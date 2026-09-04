import Image from "next/image";
import * as stylex from "@stylexjs/stylex";
import { LocaleSwitcher } from "@/features/locale-switch";
import { colors } from "@/shared/ui/tokens.stylex";

export function SiteHeader() {
  return (
    <div {...stylex.props(styles.root)}>
      <Image
        {...stylex.props(styles.logo)}
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      <LocaleSwitcher />
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  logo: {
    height: 20,
    width: 100,
    filter: colors.logoFilter,
  },
});
