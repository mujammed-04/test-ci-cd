/**
 * Generates a deterministic catalog of 1000 products into `src/data/products.json`.
 *
 * Determinism matters: the slugs drive `generateStaticParams`, so a reshuffle
 * between builds would silently change every prerendered URL. Re-run with
 * `node scripts/generate-products.mjs` after editing the word lists.
 */
import { writeFileSync, mkdirSync } from "node:fs";

const SEED = 20260827;

// mulberry32 — small, fast, fully deterministic from a 32-bit seed.
function createRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = createRandom(SEED);

const MATERIALS = {
  en: ["Oak", "Walnut", "Linen", "Merino", "Ceramic", "Brass", "Granite", "Bamboo", "Copper", "Slate", "Canvas", "Cedar", "Marble", "Terracotta", "Birch", "Cork", "Denim", "Basalt", "Maple", "Alpaca"],
  ru: ["Дубовый", "Ореховый", "Льняной", "Мериносовый", "Керамический", "Латунный", "Гранитный", "Бамбуковый", "Медный", "Сланцевый", "Парусиновый", "Кедровый", "Мраморный", "Терракотовый", "Берёзовый", "Пробковый", "Джинсовый", "Базальтовый", "Кленовый", "Альпака"],
  kk: ["Емен", "Жаңғақ", "Зығыр", "Меринос", "Керамика", "Жез", "Гранит", "Бамбук", "Мыс", "Тақтатас", "Кенеп", "Балқарағай", "Мәрмәр", "Терракота", "Қайың", "Тығын", "Джинс", "Базальт", "Үйеңкі", "Альпака"],
};

const QUALITIES = {
  en: ["Nordic", "Artisan", "Heritage", "Compact", "Everyday", "Studio", "Field", "Alpine", "Coastal", "Urban", "Classic", "Modular", "Featherweight", "Rugged", "Minimal", "Handcrafted", "Vintage", "Precision", "Quiet", "Foldable"],
  ru: ["скандинавский", "ремесленный", "винтажный", "компактный", "повседневный", "студийный", "походный", "альпийский", "прибрежный", "городской", "классический", "модульный", "сверхлёгкий", "прочный", "минималистичный", "ручной работы", "ретро", "прецизионный", "бесшумный", "складной"],
  kk: ["скандинавиялық", "қолөнер", "мұралық", "ықшам", "күнделікті", "студиялық", "далалық", "альпілік", "жағалау", "қалалық", "классикалық", "модульдік", "жеңіл", "берік", "минималды", "қолдан жасалған", "винтаж", "дәл", "тыныш", "жиналмалы"],
};

const OBJECTS = {
  en: ["Chair", "Lamp", "Mug", "Satchel", "Notebook", "Kettle", "Planter", "Bench", "Clock", "Vase", "Stool", "Tray", "Bowl", "Shelf", "Blanket", "Pitcher", "Cutting Board", "Desk Pad", "Bookend", "Storage Box", "Coat Hook", "Mirror", "Basket", "Candle Holder", "Watering Can"],
  ru: ["стул", "светильник", "кружка", "сумка", "блокнот", "чайник", "кашпо", "скамья", "часы", "ваза", "табурет", "поднос", "миска", "полка", "плед", "кувшин", "разделочная доска", "коврик для стола", "держатель для книг", "ящик для хранения", "крючок для одежды", "зеркало", "корзина", "подсвечник", "лейка"],
  kk: ["орындық", "шам", "кесе", "сөмке", "дәптер", "шәйнек", "гүлсауыт", "орындық-сәкі", "сағат", "ваза", "тәпішке", "науа", "тостаған", "сөре", "жамылғы", "құман", "турау тақтасы", "үстел кілемшесі", "кітап тірегі", "сақтау жәшігі", "киім ілгіші", "айна", "себет", "шам қойғыш", "суғарғыш"],
};

const OPENERS = {
  en: ["Built for daily use and finished by hand", "Designed to last a decade of ordinary mornings", "Shaped from a single block and sanded smooth", "Made in small batches by a workshop of four", "A quiet object that earns its place on the shelf", "Weighted, balanced, and pleasant to pick up", "Simple on the outside, carefully engineered within", "Stripped back to only what the object needs"],
  ru: ["Создан для ежедневного использования и доведён вручную", "Рассчитан на десятилетие обычных будней", "Вырезан из цельного куска и отшлифован до гладкости", "Выпускается малыми партиями мастерской из четырёх человек", "Тихий предмет, который заслуживает место на полке", "Взвешенный, сбалансированный и приятный в руке", "Простой снаружи, тщательно продуманный внутри", "Оставлено только то, что действительно нужно"],
  kk: ["Күнделікті қолдануға арналған, қолмен өңделген", "Он жылдық қарапайым таңдарға есептелген", "Тұтас бөліктен ойылып, тегіс тегістелген", "Төрт адамдық шеберханада шағын партиямен жасалады", "Сөреден орын алуға лайық тыныш зат", "Салмағы келіскен, қолға ұстауға жайлы", "Сырты қарапайым, іші мұқият ойластырылған", "Тек қажеттісі ғана қалдырылған"],
};

const CLOSERS = {
  en: ["It ships flat and assembles without tools.", "Every piece carries the grain it was cut from.", "The finish deepens in colour as it ages.", "Wipe it clean; it asks for nothing else.", "No two are identical, and that is the point.", "It stacks, nests, and disappears when not in use.", "Small enough to carry, sturdy enough to forget about.", "Guaranteed for ten years of honest wear."],
  ru: ["Поставляется в плоской упаковке и собирается без инструментов.", "Каждый экземпляр хранит рисунок дерева, из которого вырезан.", "Со временем покрытие становится глубже по цвету.", "Достаточно протереть — больше ничего не требуется.", "Двух одинаковых не бывает, и в этом весь смысл.", "Штабелируется, вкладывается и исчезает, когда не нужен.", "Достаточно мал, чтобы носить с собой, и достаточно крепок, чтобы о нём не думать.", "Гарантия — десять лет честной эксплуатации."],
  kk: ["Жалпақ қорапта жеткізіледі, құралсыз жиналады.", "Әр дана өзі ойылған ағаштың өрнегін сақтайды.", "Уақыт өте жабыны тереңірек түске енеді.", "Сүртіп қойсаңыз жеткілікті, басқа ештеңе қажет емес.", "Бірдей екеуі жоқ, мәні де осында.", "Үстіне қойылады, ішіне салынады, керек болмағанда көзге түспейді.", "Алып жүруге жеткілікті шағын, ұмытып кетуге жеткілікті берік.", "Он жыл адал қызметке кепілдік."],
};

const LOCALES = ["en", "ru", "kk"];

// Every field is picked by a single shared index across locales, so the lists
// must stay the same length or a translation would silently fall back to
// `undefined`. Fail loudly at generation time instead.
for (const [label, group] of Object.entries({ MATERIALS, QUALITIES, OBJECTS, OPENERS, CLOSERS })) {
  const lengths = LOCALES.map((locale) => group[locale].length);
  if (new Set(lengths).size !== 1) {
    throw new Error(
      `${label} is out of sync across locales: ${LOCALES.map((l, i) => `${l}=${lengths[i]}`).join(", ")}`,
    );
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const products = [];
const usedSlugs = new Set();

for (let i = 0; i < 1000; i++) {
  // One index per field, shared across locales, so the translations line up.
  const materialIdx = Math.floor(rand() * MATERIALS.en.length);
  const qualityIdx = Math.floor(rand() * QUALITIES.en.length);
  const objectIdx = Math.floor(rand() * OBJECTS.en.length);
  const openerIdx = Math.floor(rand() * OPENERS.en.length);
  const closerIdx = Math.floor(rand() * CLOSERS.en.length);

  const name = {};
  const description = {};

  for (const locale of LOCALES) {
    if (locale === "en") {
      name.en = `${QUALITIES.en[qualityIdx]} ${MATERIALS.en[materialIdx]} ${OBJECTS.en[objectIdx]}`;
    } else {
      // ru/kk read naturally as "<object>, <material> <quality>"
      const object = OBJECTS[locale][objectIdx];
      name[locale] = `${object.charAt(0).toUpperCase()}${object.slice(1)} — ${MATERIALS[locale][materialIdx]} ${QUALITIES[locale][qualityIdx]}`;
    }
    description[locale] = `${OPENERS[locale][openerIdx]}. ${CLOSERS[locale][closerIdx]}`;
  }

  // Slug is derived from the English name and stays identical across locales.
  let slug = slugify(name.en);
  if (usedSlugs.has(slug)) {
    let suffix = 2;
    while (usedSlugs.has(`${slug}-${suffix}`)) suffix++;
    slug = `${slug}-${suffix}`;
  }
  usedSlugs.add(slug);

  products.push({
    slug,
    sku: `SKU-${String(i + 1).padStart(4, "0")}`,
    price: 1200 + Math.floor(rand() * 48) * 250,
    name,
    description,
  });
}

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/products.json", JSON.stringify(products, null, 2) + "\n");
console.log(`Wrote ${products.length} products (${usedSlugs.size} unique slugs).`);
