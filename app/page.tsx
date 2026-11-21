import Image from "next/image";
import Link from "next/link";
import { assetPath } from "./asset-path";
import { characters } from "./characters";
import SiteFrame from "./site-frame";
import styles from "./page.module.css";

export default function Home() {
  return (
    <SiteFrame current="/">
      <main>
        <section className={styles.hero} aria-labelledby="title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow} lang="en">A SCHOOL ROMANCE VISUAL NOVEL</p>
            <h1 id="title">放課後、<br /><span>春</span>を待つ。</h1>
            <p className={styles.tagline}>きみと見つけた、<br />あの日の続きを探して。</p>
            <Link className={styles.storyLink} href="/story/">物語を読む <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.heroArt}>
            <Image
              src={assetPath("/spring-key-visual.jpg")}
              alt="桜ヶ丘学園の中庭に集まる、夏制服姿の凪紗、蘭、琴葉、理央"
              fill
              fetchPriority="high"
              sizes="(max-width: 760px) 100vw, 68vw"
            />
          </div>
        </section>

        <section className={styles.story} id="story" aria-labelledby="story-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow} lang="en">STORY</p>
            <h2 id="story-title">桜が散るまで、あと少し。</h2>
          </div>
          <p className={styles.synopsis}>
            春休み明け、桜ヶ丘学園の旧校舎で、一通の手紙を見つけた。
            差出人の名前はなく、末尾には「最後の花びらが落ちる前に、またここで」とだけ書かれている。
            手紙の主を探す放課後、きみは四人の少女と出会う。
          </p>
        </section>

        <section className={styles.characters} id="characters" aria-labelledby="character-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow} lang="en">CHARACTER</p>
            <h2 id="character-title">登場人物</h2>
          </div>
          <div className={styles.cards}>
            {characters.map((character) => (
              <article className={styles.card} key={character.id}>
                <div className={styles.portrait}>
                  <Image
                    src={assetPath(character.image)}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 46vw, 24vw"
                  />
                </div>
                <div className={styles.profile}>
                  <p className={styles.role} style={{ color: character.color }}>{character.role}</p>
                  <h3><Link href={`/characters/${character.id}/`}>{character.name}</Link></h3>
                  <p className={styles.roman} lang="en">{character.roman}</p>
                  <p className={styles.quote}>「{character.line}」</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
