import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { assetPath } from "../asset-path";
import { characters, characterNeighbors, type Character } from "../characters";
import styles from "../subpage.module.scss";

export default function CharacterShowcase({ character, detail = false }: { character: Character; detail?: boolean }) {
  const neighbors = characterNeighbors(character.id);
  const Name = detail ? "h1" : "h2";

  return (
    <>
      <nav className={styles.picker} aria-label="登場人物を選ぶ">
        {characters.map((item) => (
          <Link
            key={item.id}
            href={`/characters/${item.id}/`}
            aria-current={item.id === character.id ? (detail ? "page" : "true") : undefined}
            style={{ "--accent": item.color, "--tint": item.paper } as CSSProperties}
          >
            <span className={styles.avatar}><Image src={assetPath(item.image)} alt="" fill sizes="64px" /></span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <article className={styles.showcase} style={{ "--accent": character.color, "--tint": character.paper } as CSSProperties}>
        <div className={styles.profileArt}>
          <Image src={assetPath(character.image)} alt={character.name} fill fetchPriority="high" sizes="(max-width: 700px) 88vw, 510px" />
        </div>
        <div className={styles.profileCopy}>
          <p className={styles.kicker}>{character.cafe}</p>
          <Name className={styles.profileName}>{character.name}</Name>
          <p className={styles.fullName}>{character.fullName} <span lang="en">{character.roman}</span></p>
          <blockquote>「{character.line}」</blockquote>
          <p className={styles.description}>{character.description}</p>
        </div>
      </article>
      {detail && neighbors && (
        <nav className={styles.profileNav} aria-label="前後の登場人物">
          <Link href={`/characters/${neighbors.previous.id}/`}>← 前の人物 <strong>{neighbors.previous.name}</strong></Link>
          <Link href="/characters/">登場人物一覧</Link>
          <Link href={`/characters/${neighbors.next.id}/`}>次の人物 → <strong>{neighbors.next.name}</strong></Link>
        </nav>
      )}
    </>
  );
}
