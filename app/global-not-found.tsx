import type { Metadata } from "next";
import { RootDocument } from "@/app";
import { NotFoundMessage } from "@/shared/ui";

export const metadata: Metadata = {
  title: "404 – Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundMessage
        title="404 – Page Not Found"
        description="The page you are looking for does not exist."
      />
    </RootDocument>
  );
}
