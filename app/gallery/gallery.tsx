"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { assetPath } from "../asset-path";
import type { Artwork } from "../site-content";
import styles from "../subpage.module.scss";

const filters = [
  { value: "all", label: "すべて" },
  { value: "scene", label: "場面イラスト" },
  { value: "portrait", label: "立ち絵" },
] as const;

export default function Gallery({ artwork }: { artwork: readonly Artwork[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = filter === "all" ? artwork : artwork.filter((piece) => piece.kind === filter);
  const active = index === null ? undefined : visible[index];

  function changeArtwork(step: number) {
    setIndex((current) => current === null ? null : (current + step + visible.length) % visible.length);
  }

  return (
    <>
      <div className={styles.filters} role="group" aria-label="イラストの種類">
        {filters.map(({ value, label }) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>

      <ul className={styles.gallery}>
        {visible.map((item, position) => (
          <li key={item.image} data-kind={item.kind}>
            <button
              className={styles.galleryButton}
              type="button"
              onClick={() => { setIndex(position); dialog.current?.showModal(); }}
              aria-label={`${item.title}を拡大`}
              aria-haspopup="dialog"
            >
              <span className={styles.galleryArt}>
                <Image src={assetPath(item.image)} alt="" fill sizes="(max-width: 760px) 92vw, 760px" />
                <span className={styles.galleryZoom} aria-hidden="true">＋</span>
              </span>
              <span className={styles.galleryLabel} aria-hidden="true">{item.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        className={styles.lightbox}
        ref={dialog}
        aria-label={active?.title}
        onClose={() => setIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            changeArtwork(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {active && (
          <figure>
            <figcaption>
              <span aria-live="polite">{active.title}</span>
              <button type="button" aria-label="閉じる" autoFocus onClick={() => dialog.current?.close()}>×</button>
            </figcaption>
            <div className={styles.lightboxArt}>
              <Image src={assetPath(active.image)} alt={active.alt} fill sizes="(max-width: 900px) 94vw, 980px" />
            </div>
            <div className={styles.lightboxNav}>
              <button type="button" aria-label="前のイラスト" onClick={() => changeArtwork(-1)}>←</button>
              <span className={styles.lightboxCount}>
                {(index ?? 0) + 1}<small> / {visible.length}</small>
              </span>
              <button type="button" aria-label="次のイラスト" onClick={() => changeArtwork(1)}>→</button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
