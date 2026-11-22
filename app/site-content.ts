export const siteTitle = "木組みの街、春日和。";
export const siteTagline = "桜の帰り道、いつもの一杯。";
export const fanNotice = "『ご注文はうさぎですか？』の非公式ファンサイト";

export const hero = {
  label: "SPRING DAYS IN THE TIMBER TOWN",
  lead: "制服の肩に花びらをひとつ乗せて、今日もあの扉を開ける。",
} as const;

export const concept = {
  label: "CONCEPT",
  /* 文節ごとに分け、どの画面幅でも語の途中で折り返さないようにする */
  heading: ["春は、", "いつもの席から。"],
  body: [
    "木組みの家が肩を寄せ合う街に、桜がほどけていく季節。授業が終わったら制服のままお店に寄って、湯気の立つカップを前に、今日あったことをひとつずつ話す。",
    "このファンサイトは、そんな春のひとときを5人の姿と2つの場面で描いた、ささやかな記録です。",
  ],
} as const;

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
    number: "01",
    label: "AFTER SCHOOL",
    image: "/cafe/opening.jpg",
    title: "放課後の一杯",
    alt: "春の学校制服姿で、お茶とお菓子を用意するココアとチノ",
    kind: "scene",
    teaser: "窓の向こうに桜、カップの上には湯気。",
    caption: "ラビットハウス ／ 放課後のカウンター",
    body: [
      "学校から戻った二人は、制服のままカウンターに並ぶ。ココアは焼き菓子をお皿に分け、チノは温かいお茶を淹れる。湯気が立ちのぼるたび、木の匂いのする店内に甘い香りが混ざっていった。",
      "窓辺に桜の花びらがひとつ落ちてきて、朝には気づかなかった春の始まりを二人で眺める。今日のおすすめは、まだ名前の決まっていないお菓子。",
    ],
  },
  {
    id: "spring-shower",
    number: "02",
    label: "SPRING SHOWER",
    image: "/cafe/shower.jpg",
    title: "春雨の帰り道",
    alt: "春雨の石畳で一本の傘に入る、制服姿のリゼ、千夜、シャロ",
    kind: "scene",
    teaser: "同じ傘に入ると、いつもの道が少し短い。",
    caption: "木組みの街 ／ 春雨の石畳",
    body: [
      "下校の時間に細かな雨が降り始め、石畳には桜の花びらが貼りついていた。傘を忘れた千夜と、少し困った顔のシャロを見つけたリゼは、持ってきた一本を大きく広げる。",
      "肩が触れるくらいの距離で歩けば、聞き慣れた声もいつもより近い。雨がやむまで、三人は灯りのともる喫茶店に寄ることにした。",
    ],
  },
] as const satisfies readonly (Artwork & {
  id: string;
  number: string;
  label: string;
  teaser: string;
  caption: string;
  body: readonly string[];
})[];

export const storyIntro =
  "桜の下を歩く午後も、春雨に足を止める帰り道も。木組みの街には、ひと息つける場所がある。";

export const charactersIntro =
  "春の学校制服で喫茶店に集まる5人。名前を選ぶと、それぞれのページに切り替わります。";

export const galleryIntro =
  "キービジュアル、2つの場面イラスト、5人の立ち絵。選ぶと拡大し、← → キーで前後にめくれます。";
