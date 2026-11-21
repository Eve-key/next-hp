"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { assetPath } from "../asset-path";
import styles from "../subpage.module.css";

type Artwork = { image: `/${string}`; title: string; wide: boolean };

export default function Gallery({ artwork }: { artwork: readonly Artwork[] }) {
  const [active, setActive] = useState<Artwork | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  function openArtwork(item: Artwork) {
    setActive(item);
    dialog.current?.showModal();
  }

  return (
    <>
      <ul className={styles.gallery}>
        {artwork.map((item) => (
          <li key={item.image} className={item.wide ? styles.heroTile : undefined}>
            <button
              className={styles.galleryButton}
              type="button"
              onClick={() => openArtwork(item)}
              aria-label={`${item.title}を拡大`}
              aria-haspopup="dialog"
            >
              <div className={item.wide ? styles.galleryWide : styles.cardArt}>
                <Image src={assetPath(item.image)} alt="" fill sizes={item.wide ? "100vw" : "(max-width: 760px) 46vw, 270px"} />
              </div>
              <span>{item.title}<span aria-hidden="true">＋</span></span>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        className={styles.lightbox}
        ref={dialog}
        aria-labelledby={titleId}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {active && (
          <figure>
            <figcaption id={titleId}>
              {active.title}
              <button type="button" aria-label="閉じる" autoFocus onClick={() => dialog.current?.close()}>×</button>
            </figcaption>
            <Image
              src={assetPath(active.image)}
              alt={active.title}
              width={active.wide ? 1536 : 557}
              height={active.wide ? 1024 : 659}
            />
          </figure>
        )}
      </dialog>
    </>
  );
}
