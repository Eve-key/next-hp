# 木組みの街、春日和。

『ご注文はうさぎですか？』の非公式ファンサイトです。春の喫茶店を舞台に、5人のプロフィール、2つの日常エピソード、拡大して前後にめくれるイラストギャラリーを紹介します。

## ローカルで開く

Node.js 24.15.0 を使います。

```sh
npm ci
npm run dev
```

開発サーバーは `http://localhost:3000` で開きます。静的エクスポートを確認するときは `npm run build` の後に `npm start` を実行してください。

## テスト

```sh
npx playwright install chromium --only-shell
npm run lint
npm run test:unit
npm run build
npm run test:e2e
npm run test:vrt
```

- UNIT はキャラクターのID、素材、前後ナビゲーションを確認します。
- E2E は静的ビルドを使用し、主要ページへの遷移、5人の直リンクと切り替え、404、ギャラリーの絞り込みとキーボード操作、動きを減らす設定を確認します。
- VRT は同じビルドの主要5画面をデスクトップ・モバイルの2幅で比較します。基準画像は `tests/browser/snapshots/` にあります。意図したデザイン変更がある場合は Windows 上で `npm run test:vrt:update` を実行し、画像差分をレビューしてください。CI と同じ Windows・Chromium で撮影し、同梱の Noto Sans JP と Noto Serif JP でフォント差を抑えています。

## CI/CD

Pull Request と `main` への push で GitHub Actions が lint、UNIT、静的ビルド、E2E、VRT を実行します。CI は本番と同じ `/next-hp` 配下で検証します。失敗時は Actions の `playwright-report` にブラウザーのトレースと画像差分が保存されます。

GitHub Pages の公開元は **Settings → Pages → Build and deployment → GitHub Actions** です。`main` の検証成功後に、そのジョブで検証した `out/` を Pages に配信します。サブパスをローカルで再現する場合は `NEXT_PUBLIC_BASE_PATH=/next-hp` を設定した同じシェルからビルド、プレビュー、ブラウザーテストを実行してください。
