import type { Metadata } from "next";
import { characters } from "../characters";
import SiteFrame from "../site-frame";
import styles from "../subpage.module.scss";
import CharacterShowcase from "./showcase";

export const metadata: Metadata = {
  title: "登場人物",
  description: "ココア、チノ、リゼ、千夜、シャロの春の学校制服姿とプロフィール。",
};

export default function Characters() {
  return (
    <SiteFrame current="/characters/">
      <main className={styles.page}>
        <header className={styles.title}>
          <p lang="en">CHARACTER</p><h1>登場人物</h1>
        </header>
        <CharacterShowcase character={characters[0]} />
      </main>
    </SiteFrame>
  );
}
