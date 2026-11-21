import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { assetPath } from "../asset-path";
import { characters } from "../characters";
import SiteFrame from "../site-frame";
import styles from "../subpage.module.scss";

export const metadata: Metadata = {
  title: "登場人物 | 放課後、春を待つ。",
  description: "桜ヶ丘学園で出会う四人のプロフィール。",
};

export default function Characters() {
  return (
    <SiteFrame current="/characters/">
      <main className={styles.page}>
        <header className={styles.title}>
          <p lang="en">CHARACTER</p>
          <h1>登場人物</h1>
        </header>
        <ul className={styles.cardGrid}>
          {characters.map((character) => (
            <li key={character.id}>
              <Link
                href={`/characters/${character.id}/`}
                className={styles.card}
                style={{ "--character-accent": character.color } as CSSProperties}
              >
                <div className={styles.cardArt}>
                  <Image src={assetPath(character.image)} alt="" fill sizes="(max-width: 760px) 46vw, 270px" />
                </div>
                <div className={styles.cardBody}>
                  <p>{character.role}</p>
                  <h2>{character.name}</h2>
                  <span lang="en">{character.roman}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </SiteFrame>
  );
}
