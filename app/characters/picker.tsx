import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { assetPath } from "../asset-path";
import { characters } from "../characters";
import styles from "../subpage.module.scss";

/**
 * 登場人物の切り替え。
 * 一覧では大きな札、個別ページでは上部の細い帯として同じ並び順で出すことで、
 * 「いま誰を見ているか」と「どこへ移れるか」を一目で分かるようにする。
 * リンクの読み上げ名は名前だけに保ち、添える文字は装飾として隠す。
 */
export default function CharacterPicker({
  activeId,
  variant,
}: {
  activeId?: string;
  variant: "roster" | "strip";
}) {
  return (
    <nav
      aria-label="登場人物を選ぶ"
      className={variant === "roster" ? styles.roster : styles.strip}
    >
      {characters.map((character, index) => {
        const active = character.id === activeId;
        return (
          <Link
            key={character.id}
            href={`/characters/${character.id}/`}
            aria-current={active ? "page" : undefined}
            style={{ "--accent": character.color, "--tint": character.paper } as CSSProperties}
          >
            <span className={styles.pickerArt}>
              <Image
                src={assetPath(character.image)}
                alt=""
                fill
                sizes={variant === "roster" ? "(max-width: 760px) 44vw, 230px" : "80px"}
              />
            </span>
            <span className={styles.pickerName}>
              {character.name}
              <span aria-hidden="true" lang="en">{character.roman}</span>
            </span>
            {variant === "roster" && (
              <span className={styles.pickerExtra} aria-hidden="true">
                <em>{character.cafe}</em>
                <b>{String(index + 1).padStart(2, "0")}</b>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
