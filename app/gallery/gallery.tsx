"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { assetPath } from "../asset-path";
import type { Artwork } from "../site-content";
import styles from "../subpage.module.scss";
import { getFavorites, getServerFavorites, subscribeFavorites, toggleSavedFavorite } from "./favorites";

const filters = [
  { value: "all", label: "すべて" },
  { value: "scene", label: "場面イラスト" },
  { value: "portrait", label: "立ち絵" },
  { value: "favorites", label: "お気に入り" },
] as const;

export default function Gallery({ artwork }: { artwork: readonly Artwork[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  // 開いている絵は一覧の位置でなく画像パスで持つ（別タブで一覧が変わっても同じ絵を指す）
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filterGroup = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const empty = useRef<HTMLParagraphElement>(null);
  // 解除で消えたカードの代わりにフォーカスを渡す先（画像パス、または空の案内）
  const focusAfterRemoval = useRef<string | null>(null);
  const favorites = useSyncExternalStore(subscribeFavorites, getFavorites, getServerFavorites);
  const visible = filter === "all" ? artwork
    : filter === "favorites" ? artwork.filter((piece) => favorites.includes(piece.image))
    : artwork.filter((piece) => piece.kind === filter);
  const index = activeImage === null ? -1 : visible.findIndex((piece) => piece.image === activeImage);
  const active = index === -1 ? undefined : visible[index];
  const activeMissing = activeImage !== null && index === -1;

  // 開いている絵が一覧から外れたら閉じる（後始末とフォーカスの戻し先は onClose が受け持つ）
  useLayoutEffect(() => {
    if (activeMissing) dialog.current?.close();
  }, [activeMissing]);

  // ネイティブダイアログは開いたボタンへフォーカスを戻す。そのボタンが別タブでの解除などで
  // 消えていたとき（フォーカスが body か、閉じたダイアログの中に残ったまま）だけ、選択中のフィルターへ戻す
  function handleClose() {
    setActiveImage(null);
    const focused = document.activeElement;
    if (!focused || focused === document.body || dialog.current?.contains(focused)) {
      filterGroup.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
    }
  }

  useLayoutEffect(() => {
    const target = focusAfterRemoval.current;
    if (target === null) return;
    focusAfterRemoval.current = null;
    const button = Array.from(list.current?.querySelectorAll<HTMLButtonElement>("[data-favorite]") ?? [])
      .find((candidate) => candidate.dataset.favorite === target);
    (button ?? empty.current)?.focus();
  }, [favorites]);

  function toggle(image: string, position: number) {
    if (filter === "favorites" && favorites.includes(image)) {
      const neighbor = visible[position + 1] ?? visible[position - 1];
      focusAfterRemoval.current = neighbor?.image ?? "";
    }
    toggleSavedFavorite(image);
  }

  function changeArtwork(step: number) {
    if (index === -1) return;
    setActiveImage(visible[(index + step + visible.length) % visible.length].image);
  }

  return (
    <>
      <div className={styles.filters} ref={filterGroup} role="group" aria-label="イラストの種類">
        {filters.map(({ value, label }) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>

      {filter === "favorites" && visible.length === 0 && (
        <p className={styles.galleryEmpty} ref={empty} tabIndex={-1}>
          まだお気に入りはありません。各イラストの「☆ お気に入り」で保存すると、ここから見返せます。
        </p>
      )}

      <ul className={styles.gallery} ref={list} aria-label="イラスト一覧">
        {visible.map((item, position) => {
          const saved = favorites.includes(item.image);
          return (
            <li key={item.image} data-kind={item.kind}>
              <button
                className={styles.galleryButton}
                type="button"
                onClick={() => { setActiveImage(item.image); dialog.current?.showModal(); }}
                aria-label={`${item.title}を拡大`}
                aria-haspopup="dialog"
              >
                <span className={styles.galleryArt}>
                  <Image src={assetPath(item.image)} alt="" fill sizes="(max-width: 760px) 92vw, 760px" />
                  <span className={styles.galleryZoom} aria-hidden="true">＋</span>
                </span>
                <span className={styles.galleryLabel} aria-hidden="true">{item.title}</span>
              </button>
              <button
                className={styles.favoriteButton}
                type="button"
                data-favorite={item.image}
                aria-pressed={saved}
                aria-label={`${item.title}をお気に入りに保存`}
                onClick={() => toggle(item.image, position)}
              >
                <span aria-hidden="true">{saved ? "★" : "☆"}</span>
                <span className={styles.favoriteText}>お気に入り</span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        className={styles.lightbox}
        ref={dialog}
        aria-label={active?.title}
        onClose={handleClose}
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
                {index + 1}<small> / {visible.length}</small>
              </span>
              <button type="button" aria-label="次のイラスト" onClick={() => changeArtwork(1)}>→</button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
