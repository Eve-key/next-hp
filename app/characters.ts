export const characters = [
  {
    id: "nagisa",
    name: "登坂 凪紗",
    roman: "Nagisa Tosaka",
    role: "学園のうわさを追う新聞部員",
    color: "#28655c",
    image: "/spring-character-1.jpg",
    line: "まだ記事にはしないよ。きみが話してくれるまではね。",
    year: "2年",
    club: "新聞部",
    description: "旧校舎に手紙が残されていたと聞いて、真っ先に取材を申し込んできた。目ざとくて遠慮がないように見えるけれど、聞いたことを記事にするかどうかはいつも本人に確かめる。カメラの中には、学園の誰も気づかない小さな変化が写っている。",
  },
  {
    id: "ran",
    name: "御影 蘭",
    roman: "Ran Mikage",
    role: "放課後の音楽室で弾く伴奏者",
    color: "#374773",
    image: "/spring-character-2.jpg",
    line: "最後まで聴いていって。今日は、あなたのために弾くから。",
    year: "3年",
    club: "合唱部",
    description: "合唱部の伴奏を引き受けている先輩。練習が終わると、いつも古い楽譜を開いて同じ曲を弾く。静かな音楽室に迎え入れてくれるようになると、その曲の最後の一ページだけが欠けていることに気がつく。",
  },
  {
    id: "kotoha",
    name: "小日向 琴葉",
    roman: "Kotoha Kohinata",
    role: "なんでも繕う手芸部員",
    color: "#8c4932",
    image: "/spring-character-3.jpg",
    line: "ほら、直ったよ。お礼は明日の放課後、ここに来ること。",
    year: "2年",
    club: "手芸部",
    description: "制服のほつれから文化祭の幕まで、頼まれるとつい引き受けてしまう。手を動かしているときほどおしゃべりで、旧校舎のカーテンに誰かが縫い残した花のことも、針仕事の途中で教えてくれた。",
  },
  {
    id: "rio",
    name: "篠宮 理央",
    roman: "Rio Shinomiya",
    role: "屋上で雲を観察する気象部員",
    color: "#664c85",
    image: "/spring-character-4.jpg",
    line: "もうすぐ降るみたい。傘、一本でよければ。",
    year: "1年",
    club: "気象部",
    description: "昼休みになると屋上で雲の形や風向きをノートに記録する。話すのは少し苦手で、会話に困ると空を見上げる。雨の降り始めを正確に言い当てる彼女は、手紙が見つかった日の天気も覚えていた。",
  },
] as const;

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
