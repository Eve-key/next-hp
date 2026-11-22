import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { assetPath } from "./asset-path";
import { characters } from "./characters";
import SiteFrame from "./site-frame";
import { concept, episodes, fanNotice, hero, keyVisual, siteTagline } from "./site-content";
import styles from "./page.module.scss";

const petals = [6, 19, 34, 52, 71, 88];

const galleryStrip = [keyVisual, ...episodes, ...characters.slice(0, 3)];

export default function Home() {
  return (
    <SiteFrame current="/">
      <main>
        <section className={styles.hero} aria-labelledby="title">
          <div className={styles.heroStage}>
            <div className={styles.heroArt}>
              <Image src={assetPath(keyVisual.image)} alt={keyVisual.alt} fill fetchPriority="high" sizes="100vw" />
            </div>
            <div className={styles.petals} aria-hidden="true">
              {petals.map((left, index) => (
                <span key={left} style={{ "--left": `${left}%`, "--order": index } as CSSProperties} />
              ))}
            </div>
          </div>

          <div className={styles.heroCopy}>
            <span className={styles.heroThread} aria-hidden="true" />
            <p className={styles.heroLabel} lang="en">{hero.label}</p>
            <h1 id="title"><span>木組みの街、</span><span>春日和。</span></h1>
            <p className={styles.heroTagline}>{siteTagline}</p>
            <p className={styles.heroLead}>{hero.lead}</p>
            <div className={styles.heroActions}>
              <Link href="/story/" className={styles.primary}>物語を読む <span aria-hidden="true">→</span></Link>
              <Link href="/characters/" className={styles.ghost}>登場人物を見る <span aria-hidden="true">→</span></Link>
            </div>
            <p className={styles.heroNotice}>{fanNotice}</p>
          </div>
        </section>

        <section className={styles.concept} aria-labelledby="concept">
          <div className={styles.conceptInner}>
            <div className={styles.conceptHead}>
              <p lang="en">{concept.label}</p>
              <h2 id="concept">
                {concept.heading.map((phrase) => <span key={phrase}>{phrase}</span>)}
              </h2>
            </div>
            <div className={styles.conceptBody}>
              {concept.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        <section className={styles.castSection} aria-labelledby="cast">
          <div className={styles.castInner}>
            <div className={styles.sectionHead}>
              <p lang="en">CHARACTER</p>
              <h2 id="cast"><span>春の制服で</span><span>出会う、5人。</span></h2>
              <Link href="/characters/" className={styles.more}>登場人物を見る <span aria-hidden="true">→</span></Link>
            </div>
            <ul className={styles.cast}>
              {characters.map((character) => (
                <li key={character.id} style={{ "--accent": character.color, "--tint": character.paper } as CSSProperties}>
                  <Link href={`/characters/${character.id}/`}>
                    <div className={styles.castArt}>
                      <Image src={assetPath(character.image)} alt="" fill sizes="(max-width: 760px) 44vw, 240px" />
                    </div>
                    <div className={styles.castName}>
                      <strong>{character.name}</strong>
                      <span lang="en">{character.roman}</span>
                      <em>{character.cafe}</em>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.sceneSection} aria-labelledby="scenes">
          <div className={styles.sceneInner}>
            <div className={styles.sectionHead}>
              <p lang="en">STORY</p>
              <h2 id="scenes"><span>喫茶店の、</span><span>春のひとこま。</span></h2>
              <Link href="/story/" className={styles.more}>物語を読む <span aria-hidden="true">→</span></Link>
            </div>
            <div className={styles.scenes}>
              {episodes.map((episode) => (
                <article className={styles.scene} key={episode.id}>
                  <Link href={`/story/#${episode.id}`}>
                    <div className={styles.sceneArt}>
                      <Image src={assetPath(episode.image)} alt={episode.alt} fill sizes="(max-width: 900px) 92vw, 560px" />
                    </div>
                    <div className={styles.sceneCopy}>
                      <p className={styles.sceneNumber}><b lang="en">{episode.number}</b><span lang="en">{episode.label}</span></p>
                      <h3>{episode.title}</h3>
                      <p className={styles.sceneTeaser}>{episode.teaser}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.gallerySection} aria-labelledby="gallery">
          <div className={styles.galleryInner}>
            <div className={styles.sectionHead}>
              <p lang="en">GALLERY</p>
              <h2 id="gallery"><span>集めた、</span><span>春の絵。</span></h2>
              <Link href="/gallery/" className={styles.more}>ギャラリーを見る <span aria-hidden="true">→</span></Link>
            </div>
            <ul className={styles.strip} aria-hidden="true">
              {galleryStrip.map((piece) => (
                <li key={piece.image}>
                  <Image src={assetPath(piece.image)} alt="" fill sizes="(max-width: 760px) 30vw, 200px" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
