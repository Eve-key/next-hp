import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { assetPath } from "../asset-path";
import { characterNeighbors, type Character } from "../characters";
import styles from "../subpage.module.scss";
import CharacterPicker from "./picker";

export default function CharacterShowcase({ character }: { character: Character }) {
  const neighbors = characterNeighbors(character.id);

  return (
    <div
      className={styles.profile}
      style={{ "--accent": character.color, "--tint": character.paper } as CSSProperties}
    >
      <div className={styles.profileTop}>
        <CharacterPicker activeId={character.id} variant="strip" />
      </div>

      {/* 立ち絵の地色をそのまま面へ広げ、人物が画面を占める */}
      <article className={styles.showcase}>
        <div className={styles.showcaseInner}>
          <span className={styles.watermark} aria-hidden="true" lang="en">{character.roman}</span>
          <div className={styles.profileArt}>
            <Image
              src={assetPath(character.image)}
              alt={character.name}
              fill
              fetchPriority="high"
              sizes="(max-width: 900px) 92vw, 560px"
            />
          </div>
          <div className={styles.profileCopy}>
            <p className={styles.kicker}>{character.cafe}</p>
            <h1 className={styles.profileName}>{character.name}</h1>
            <p className={styles.fullName}>
              {character.fullName}
              <span lang="en">{character.roman}</span>
            </p>
            <blockquote>「{character.line}」</blockquote>
            <p className={styles.description}>{character.description}</p>
          </div>
        </div>
      </article>

      {neighbors && (
        <nav className={styles.profileNav} aria-label="前後の登場人物">
          <Link href={`/characters/${neighbors.previous.id}/`} className={styles.navPrev}>
            <span aria-hidden="true">←</span>
            <small>前の人物</small>
            <strong>{neighbors.previous.name}</strong>
          </Link>
          <Link href="/characters/" className={styles.navIndex}>登場人物一覧</Link>
          <Link href={`/characters/${neighbors.next.id}/`} className={styles.navNext}>
            <span aria-hidden="true">→</span>
            <small>次の人物</small>
            <strong>{neighbors.next.name}</strong>
          </Link>
        </nav>
      )}
    </div>
  );
}
