import type { Metadata } from "next";
import { characters } from "../characters";
import SiteFrame from "../site-frame";
import styles from "../subpage.module.css";
import Gallery from "./gallery";

export const metadata: Metadata = {
  title: "ギャラリー | 放課後、春を待つ。",
  description: "集合イラストと、夏制服を着た四人の立ち絵。",
};

const artwork = [
  { image: "/spring-key-visual.jpg", title: "キービジュアル", wide: true },
  ...characters.map(({ image, name }) => ({ image, title: `${name}の立ち絵`, wide: false })),
] as const;

export default function GalleryPage() {
  return (
    <SiteFrame current="/gallery/">
      <main className={styles.page}>
        <header className={styles.title}>
          <p lang="en">GALLERY</p>
          <h1>ギャラリー</h1>
        </header>
        <Gallery artwork={artwork} />
      </main>
    </SiteFrame>
  );
}
