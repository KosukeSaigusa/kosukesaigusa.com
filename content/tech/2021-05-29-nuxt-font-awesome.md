---
title: 'Nuxt.js プロジェクトに Font Awesome を導入する'
description: 'Nuxt.js プロジェクトに Font Awesome を導入する方法のメモ'
tags: ['Nuxt.js']
createdAt: 2021-05-29
slug: '2021-05-29-nuxt-font-awesome'
---

### Nuxt.js に Font Awesome を導入する

Nuxt.js (^2.15.3) で Font Awesome を使えるようにする方法を備忘の目的に記録します。

基本的には、[Nuxt Font Awesome 5](https://github.com/vaso2/nuxt-fontawesome) という npm パッケージの README の説明通りに進めていきます。

まず、Font Awesome を使いたいプロジェクトで次のコマンドを実行して nuxt-fontawesome をインストールします。

```shell
npm i nuxt-fontawesome
```

README に "Also it may be needed to explicitly install fontawesome, if your webpack build fails" と説明があるので、必要に応じて次のコマンドも実行し、明示的に fontawesome-svg-core と vue-fontawesome もインストールします。

```shell
npm i @fortawesome/fontawesome-svg-core @fortawesome/vue-fontawesome
```

また、今回は GitHub や Twitter のアイコンも使用したいので、次のコマンドも実行しておきます。

```shell
npm i @fortawesome/free-brands-svg-icons
```

次に `nuxt.config.js` または `nuxt.config.ts` に次のような記述を追加します。

```ts
{
  modules: [
    'nuxt-fontawesome',
    ]
  ],
  imports: [
    {
      set: '@fortawesome/free-solid-svg-icons',
      icons: ['fas'],
    },
    {
      set: '@fortawesome/free-brands-svg-icons',
      icons: ['fab'],
    },
  ],
}
```

imports の中の `@fortawesome/free-solid-svg-icons` や `@fortawesome/free-solid-svg-icons` という記述について、"fontawesome" ではなく "fortawesome" になっていますが、タイポではありません。 `package.json` を見ると、下記のように対応する内容を見つけることができます（もし `package.json` の中にそれらがない場合は、明示的にインストールしてください）。

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^1.2.35",
    "@fortawesome/free-brands-svg-icons": "^5.15.3",
    "@fortawesome/free-solid-svg-icons": "^5.15.3",
    "@fortawesome/vue-fontawesome": "^2.0.2"
  }
}
```

以上で必要な設定は完了しています。

たとえばこのサイトでも用いている、ホームアイコンと GitHub, Twitter のアイコンを表示するためには、 `<template>` タグの中に次のように記述すれば OK です。

```vue
<template>
  <div>
    <font-awesome-icon icon="home" />
    <font-awesome-icon :icon="['fab', 'github']" />
    <font-awesome-icon :icon="['fab', 'twitter']" />
  </div>
</template>
```
