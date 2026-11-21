import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { assetPath } from "./asset-path";
import { characters } from "./characters";
import SiteFrame from "./site-frame";
import { episodes, keyVisual } from "./site-content";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <SiteFrame current="/">
      <main>
        <section className={styles.hero} aria-labelledby="title">
          <div className={styles.heroArt}>
            <Image src={assetPath(keyVisual.image)} alt={keyVisual.alt} fill fetchPriority="high" sizes="100vw" />
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.fanLabel}>ご注文はうさぎですか？ 非公式ファンサイト</p>
            <h1 id="title"><span>木組みの街、</span><span>春日和。</span></h1>
            <p className={styles.tagline}>桜の帰り道、いつもの一杯。</p>
            <Link href="/story/" className={styles.primary}>物語を読む <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className={styles.castSection} aria-labelledby="cast">
          <div className={styles.sectionHeading}>
            <div><p lang="en">CHARACTER</p><h2 id="cast">春の制服で出会う5人</h2></div>
            <Link href="/characters/">登場人物を見る <span aria-hidden="true">→</span></Link>
          </div>
          <ul className={styles.cast}>
            {characters.map((character) => (
              <li key={character.id} style={{ "--accent": character.color, "--tint": character.paper } as CSSProperties}>
                <Link href={`/characters/${character.id}/`}>
                  <div className={styles.castArt}>
                    <Image src={assetPath(character.image)} alt="" fill sizes="(max-width: 700px) 42vw, 220px" />
                  </div>
                  <div className={styles.castName}><strong>{character.name}</strong><span lang="en">{character.roman}</span></div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.sceneSection} aria-labelledby="scenes">
          <div className={styles.sectionHeading}>
            <div><p lang="en">STORY</p><h2 id="scenes">喫茶店の春のひとこま</h2></div>
            <Link href="/gallery/">ギャラリーを見る <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.scenes}>
            {episodes.map((episode) => (
              <Link key={episode.id} href={`/story/#${episode.id}`}>
                <div className={styles.sceneArt}>
                  <Image src={assetPath(episode.image)} alt={episode.alt} fill sizes="(max-width: 700px) 92vw, 520px" />
                </div>
                <div className={styles.sceneCopy}><h3>{episode.title}</h3><p>{episode.teaser}</p></div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
