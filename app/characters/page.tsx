import type { Metadata } from "next";
import SiteFrame from "../site-frame";
import { charactersIntro } from "../site-content";
import styles from "../subpage.module.scss";
import CharacterPicker from "./picker";

export const metadata: Metadata = {
  title: "登場人物",
  description: "ココア、チノ、リゼ、千夜、シャロの春の学校制服姿とプロフィール。",
};

export default function Characters() {
  return (
    <SiteFrame current="/characters/">
      <main className={styles.page}>
        <header className={styles.title}>
          <p lang="en">CHARACTER</p>
          <h1>登場人物</h1>
          <p className={styles.intro}>{charactersIntro}</p>
        </header>
        <CharacterPicker variant="roster" />
      </main>
    </SiteFrame>
  );
}
