export const characters = [
  {
    id: "cocoa", name: "ココア", fullName: "保登 心愛", roman: "Cocoa Hoto",
    cafe: "ラビットハウス", color: "#9b455b", paper: "#f8e0e5",
    image: "/cafe/cocoa.jpg",
    line: "春の新メニュー、みんなで味見しようよ！",
    description: "ラビットハウスに住み込みで働く、明るく人懐っこい女の子。パンを焼くのが得意で、お店に初めて来た人にも気軽に声をかける。この春は、季節のお茶と一緒に出すお菓子を考えている。",
  },
  {
    id: "chino", name: "チノ", fullName: "香風 智乃", roman: "Chino Kafuu",
    cafe: "ラビットハウス", color: "#346789", paper: "#dfedf6",
    image: "/cafe/chino.jpg",
    line: "まだ温かいうちに、ひと口どうぞ。",
    description: "ラビットハウスの看板娘。控えめでしっかり者で、コーヒーを淹れる手つきはいつも丁寧。放課後の静かな店内で、春の焼き菓子に合うお茶を選ぶ。",
  },
  {
    id: "rize", name: "リゼ", fullName: "天々座 理世", roman: "Rize Tedeza",
    cafe: "ラビットハウス", color: "#684582", paper: "#ebe3f3",
    image: "/cafe/rize.jpg",
    line: "テラスは任せろ。雨が来る前に片づけよう！",
    description: "きびきびした動きで店を支えるラビットハウスのアルバイト。頼られると放っておけず、忙しい午後ほど力を発揮する。春の雨に備えて、大きめの傘を一本用意した。",
  },
  {
    id: "chiya", name: "千夜", fullName: "宇治松 千夜", roman: "Chiya Ujimatsu",
    cafe: "甘兎庵", color: "#43674f", paper: "#e5efde",
    image: "/cafe/chiya.jpg",
    line: "この甘味、桜雲のひとやすみって名前はどうかしら。",
    description: "和風喫茶・甘兎庵で働く、穏やかな女の子。季節の甘味を考えるのが好きで、つける名前はいつも少し独特。春の新作を持って、ラビットハウスへ顔を出す。",
  },
  {
    id: "sharo", name: "シャロ", fullName: "桐間 紗路", roman: "Sharo Kirima",
    cafe: "フルール・ド・ラパン", color: "#805922", paper: "#f9edcd",
    image: "/cafe/sharo.jpg",
    line: "今日はコーヒーじゃなくて、温かいハーブティーにしておくわ。",
    description: "フルール・ド・ラパンで働き、ハーブにも詳しい。何かと真面目で、幼なじみの千夜にはつい世話を焼いてしまう。思いがけず春雨が降った日、二人で帰るつもりだった傘にリゼも加わることに。",
  },
] as const;

export type Character = (typeof characters)[number];

export function findCharacter(id: string) {
  return characters.find((character) => character.id === id);
}

export function characterNeighbors(id: string) {
  const index = characters.findIndex((character) => character.id === id);
  if (index === -1) return undefined;

  const count = characters.length;
  return {
    previous: characters[(index + count - 1) % count],
    next: characters[(index + 1) % count],
  };
}
