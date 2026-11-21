import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { characters, findCharacter } from "../../characters";
import SiteFrame from "../../site-frame";
import styles from "../../subpage.module.scss";
import CharacterShowcase from "../showcase";

type ProfileProps = { params: Promise<{ id: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return characters.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: ProfileProps): Promise<Metadata> {
  const character = findCharacter((await params).id);
  if (!character) notFound();
  return { title: character.name, description: character.description };
}

export default async function Profile({ params }: ProfileProps) {
  const character = findCharacter((await params).id);
  if (!character) notFound();

  return (
    <SiteFrame>
      <main className={styles.page}>
        <CharacterShowcase character={character} detail />
      </main>
    </SiteFrame>
  );
}
