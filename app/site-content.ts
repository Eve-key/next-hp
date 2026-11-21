export const siteTitle = "木組みの街、春日和。";

export type Artwork = {
  image: `/${string}`;
  title: string;
  alt: string;
  kind: "key" | "scene" | "portrait";
};

export const keyVisual = {
  image: "/cafe/key-visual.jpg",
  title: "キービジュアル",
  alt: "桜が咲く木組みの街で、春の学校制服を着たココア、チノ、リゼ、千夜、シャロ",
  kind: "key",
} as const satisfies Artwork;

export const episodes = [
  {
    id: "after-school",
    image: "/cafe/opening.jpg",
    title: "放課後の一杯",
    alt: "春の学校制服姿で、お茶とお菓子を用意するココアとチノ",
    kind: "scene",
    teaser: "窓の向こうに桜、カップの上には湯気。",
    text: "学校から戻った二人は、制服のままカウンターに並ぶ。ココアは焼き菓子をお皿に分け、チノは温かいお茶を淹れる。窓辺に桜の花びらがひとつ落ちてきて、朝には気づかなかった春の始まりを二人で眺めた。",
  },
  {
    id: "spring-shower",
    image: "/cafe/shower.jpg",
    title: "春雨の帰り道",
    alt: "春雨の石畳で一本の傘に入る、制服姿のリゼ、千夜、シャロ",
    kind: "scene",
    teaser: "同じ傘に入ると、いつもの道が少し短い。",
    text: "下校の時間に細かな雨が降り始め、石畳には桜の花びらが貼りついていた。傘を忘れた千夜と、少し困った顔のシャロを見つけたリゼは、持ってきた傘を広げる。雨がやむまで、三人は温かい灯りのともる喫茶店に寄ることにした。",
  },
] as const satisfies readonly (Artwork & { id: string; teaser: string; text: string })[];
