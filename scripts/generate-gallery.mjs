import { writeFile } from "node:fs/promises";

const GROQ_API_KEY = requireEnv("GROQ_API_KEY");
const PEXELS_API_KEY = requireEnv("PEXELS_API_KEY");
const count = clamp(Number.parseInt(process.env.PHOTO_COUNT ?? "6", 10) || 6, 1, 20);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Seeded into the Groq call so repeated runs do not converge on the same themes.
const THEMES = [
  "handmade ceramics", "nordic interiors", "morning light", "urban textures",
  "still life", "workshop tools", "linen and wood", "quiet architecture",
  "coastal weather", "analogue film grain", "botanical detail", "minimal desks",
];

function pickThemes(n) {
  const pool = [...THEMES];
  const picked = [];
  while (picked.length < n && pool.length) {
    picked.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
  }
  return picked;
}

async function generatePrompts() {
  const seeds = pickThemes(Math.min(count, THEMES.length)).join(", ");
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      temperature: 1.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write short photo search queries for a stock photo library. " +
            'Reply with JSON: {"prompts": ["...", "..."]}. ' +
            "Each prompt is 2-4 plain English words, concrete and visual, no punctuation. " +
            "Use only nouns and adjectives - never connecting words like on, in, at, with, of, the.",
        },
        {
          role: "user",
          content: `Give exactly ${count} distinct photo search prompts. Loose inspiration: ${seeds}.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq request failed: ${response.status} ${await response.text()}`);
  }

  const body = await response.json();
  const parsed = JSON.parse(body.choices[0].message.content);
  const prompts = (parsed.prompts ?? []).filter((p) => typeof p === "string" && p.trim());

  if (!prompts.length) throw new Error("Groq returned no usable prompts");
  return prompts.slice(0, count);
}

async function findPhoto(prompt) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", prompt);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "15");

  const response = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });

  if (response.status === 429) {
    const reset = response.headers.get("x-ratelimit-reset");
    throw new Error(`Pexels rate limit exceeded${reset ? ` (resets at ${new Date(Number(reset) * 1000).toISOString()})` : ""}.`);
  }
  if (!response.ok) {
    throw new Error(`Pexels request failed: ${response.status} ${await response.text()}`);
  }

  const { photos = [] } = await response.json();
  if (!photos.length) {
    console.warn(`No photo for "${prompt}"`);
    return null;
  }

  // One request returns a page of candidates; picking randomly keeps the gallery
  // varied without spending an extra request per photo.
  const photo = photos[Math.floor(Math.random() * photos.length)];

  return {
    prompt,
    id: String(photo.id),
    url: photo.src.large2x,
    thumb: photo.src.medium,
    width: photo.width,
    height: photo.height,
    color: photo.avg_color,
    alt: photo.alt || prompt,
    // Pexels asks for a visible credit to the photographer and a link back.
    credit: {
      name: photo.photographer,
      link: photo.photographer_url,
      photoLink: photo.url,
    },
  };
}

const prompts = await generatePrompts();
const photos = [];
for (const prompt of prompts) {
  const photo = await findPhoto(prompt);
  if (photo) photos.push(photo);
}

if (!photos.length) throw new Error("No photos found for any generated prompt");

await writeFile(
  new URL("../src/data/gallery.json", import.meta.url),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), photos }, null, 2)}\n`,
);

console.log(`Wrote ${photos.length} photo(s) to src/data/gallery.json`);
