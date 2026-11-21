import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { assetPath } from "../../asset-path";
import { characters, findCharacter, characterNeighbors } from "../../characters";
import SiteFrame from "../../site-frame";
import styles from "../../subpage.module.css";

type ProfileProps = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return characters.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: ProfileProps): Promise<Metadata> {
  const character = findCharacter((await params).id);
  if (!character) notFound();

  return {
    title: `${character.name} | 放課後、春を待つ。`,
    description: character.description,
  };
}

export default async function CharacterProfile({ params }: ProfileProps) {
  const { id } = await params;
  const character = findCharacter(id);
  const neighbors = characterNeighbors(id);
  if (!character || !neighbors) notFound();

  return (
    <SiteFrame>
      <main className={styles.page}>
        <Link className={styles.back} href="/characters/">← 登場人物一覧</Link>
        <article className={styles.profile}>
          <div className={styles.profileArt}>
            <Image src={assetPath(character.image)} alt={character.name} fill sizes="(max-width: 760px) 90vw, 475px" fetchPriority="high" />
          </div>
          <div className={styles.profileText}>
            <p className={styles.role} style={{ color: character.color }}>{character.role}</p>
            <h1>{character.name}</h1>
            <p className={styles.roman} lang="en">{character.roman}</p>
            <blockquote>「{character.line}」</blockquote>
            <dl className={styles.profileFacts}>
              <div><dt>学年</dt><dd>{character.year}</dd></div>
              <div><dt>所属</dt><dd>{character.club}</dd></div>
            </dl>
            <p className={styles.biography}>{character.description}</p>
          </div>
        </article>
        <nav className={styles.profileNav} aria-label="キャラクター切り替え">
          <Link href={`/characters/${neighbors.previous.id}/`}><span>← 前の人物</span>{neighbors.previous.name}</Link>
          <Link href={`/characters/${neighbors.next.id}/`}><span>次の人物 →</span>{neighbors.next.name}</Link>
        </nav>
      </main>
    </SiteFrame>
  );
}
