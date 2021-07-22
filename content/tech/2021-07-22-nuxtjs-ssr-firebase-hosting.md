---
title: 'Nuxt.js SSR サイトを Cloud Functions と Firebase Hosting でデプロイする'
description: 'Nuxt.js SSR のサイトを Cloud Functions と Firebase Hosting でデプロイする方法の記録'
tags: ['Nuxt.js', 'SSR', 'Cloud Functions', 'Firebase Hosting', 'TypeScript']
createdAt: 2021-07-22
slug: '2021-07-22-nuxtjs-ssr-firebase-hosting'
---

### Nuxt.js SSR サイトを Cloud Functions と Firebase Hosting でデプロイする

Nuxt.js の SSR で作ったサイトを、Firebase Hosting でデプロイしてみたいと思い調べながらやったことをメモします。

何点かつまづくポイントもあったので、記録として残しつつ、同様のことをやってみようとしている方の目に止まることがあれば参考になれば良いなと思って記録します。

まず、Firebase Hosting は本来は静的なサイトをホスティングするためのサービスであるため、たとえば Nuxt.js の SSG のサイトと比較すると、SSG で生成される `dist` ディレクトリの中身をそのままデプロイすれば良いというわけではないことを知っておく必要があります。

と言ってもそれほど難しいことではなく、Nuxt.js の SSR サイトの成果物である JavaScript のファイル郡とその他の必要な静的な asset をFirebase Hosting にデプロイし、その URL に対するアクセスを Firebase Hosting の `rewrites` ルールによって、同じく Firebase で提供されている Cloud Functions に作った HTTP 関数に向けるようにし、その HTTP 関数で Nuxt.js のレンダリング関数を実行するという流れを実現すれば良いということです。

以下では、そのような流れを実現する方法をまとめます。

ディレクトリ構成や使用しているパッケージ、Nuxt.js の各種設定などはこれを実現するための唯一の方法ではなく、どのような方法でも上記の流れを実現することができれば問題ありません。

参考に、今回作った GitHub リポジトリと、デプロイしたサンプルサイトが確認できる Firebase Hosting の URL を記載しておきます。

[今回作った GitHub リポジトリ](https://github.com/KosukeSaigusa/nuxt-js-ssr-firebase-hosting)

<https://nuxt-js-firebase-hosting.web.app/>

### 作業手順

まずは、作業用のディレクトリを任意の場所に作ります。今回は `nuxt-js-ssr-firebase-hosting` としておきました。このディレクトリで `git init` して Git の管理対象にしました。

```shell
mkdir nuxt-js-ssr-firebase-hosting
```

次に、Nuxt.js のアプリを生成します。アプリ名は `nuxt-app` としておきました。

```shell
npm init nuxt-app nuxt-app
```

CLI で各種のプロジェクト設定を行っていきますが、今回は下記のようにしておきました。ポイントは、SSR ができるように Rendering model を Universal に設定しおくこと、Deployment target で Server を選択しておくことです。また、JavaScript ではなく TypeScript の設定を選択しておきました。Prettier や ESLint などの Linting tools は好みに設定して構いません。

```shell
npm init nuxt-app nuxt-app

create-nuxt-app v3.7.1
✨  Generating Nuxt.js project in nuxt-app
? Project name: nuxt-app
? Programming language: TypeScript
? Package manager: Npm
? UI framework: None
? Nuxt.js modules: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Linting tools: ESLint, Prettier
? Testing framework: None
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Server (Node.js hosting)
? Development tools: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Continuous integration: None
? Version control system: None
```

nuxt-app ディレクトリに移動して、`npm run dev` を実行し、正しく Nuxt.js の アプリが起動できることを確認します。

```shell
cd nuxt-app
npm run dev
```

大したことではありませんが、`nuxt.config.js` は `nuxt.config.ts` にリネームしておきました。

今度は、`nuxt run build` で Nuxt.js アプリの成果物が正しくビルドされることを確認します。

```shell
npm run build
```

成果物は `.nuxt` ディレクトリにできているはずです。

次に、ひとつ上の階層に戻って firebase の初期設定を行います。Firebase CLI を使えるようにした状態で、`firebase init` コマンドを実行します。

```shell
cd ..
firebase init
```

予め Firebase プロジェクトは作っておいて、Cloud Functions が利用できるように従量課金の Blaze プランに変更しておく必要はあります。その既存のプロジェクトを使用して、下記のように Functions と Firebase Hosting を設定します。

```shell
firebase init

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  /Users/kosukesaigusa/dev_private/tmp

? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm your choices. Functions
: Configure a Cloud Functions directory and its files, Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploy
s

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add, 
but for now we'll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: nuxt-js-firebase-hosting (nuxt-js-firebase-hosting)
i  Using project nuxt-js-firebase-hosting (nuxt-js-firebase-hosting)

=== Functions Setup

A functions directory will be created in your project with sample code
pre-configured. Functions can be deployed with firebase deploy.

? What language would you like to use to write Cloud Functions? TypeScript
? Do you want to use ESLint to catch probable bugs and enforce style? Yes
✔  Wrote functions/package.json
✔  Wrote functions/.eslintrc.js
✔  Wrote functions/tsconfig.json
✔  Wrote functions/tsconfig.dev.json
✔  Wrote functions/src/index.ts
✔  Wrote functions/.gitignore
? Do you want to install dependencies with npm now? Yes

added 400 packages, and audited 401 packages in 11s

56 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

=== Hosting Setup

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build's output directory.

? What do you want to use as your public directory? public
? Configure as a single-page app (rewrite all urls to /index.html)? No
? Set up automatic builds and deploys with GitHub? No
✔  Wrote public/404.html
✔  Wrote public/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...
i  Writing gitignore file to .gitignore...

✔  Firebase initialization complete!
```

この時点で、ルートディレクトリには、はじめに作った `nuxt-app` の Nuxt.js アプリのディレクトリに加えて、`functions` というディレクトリと `public` というディレクトリが生成され、同階層に `.firebaserc` と `firebase.json` もできています。

`public` ディレクトリの中に `index.html` と `404.html` も生成されていますが、後から削除するので使いません。

`functions` ディレクトリに移動して、必要なパッケージをインストールします。

```shell
cd functions
npm install nuxt
```

`functions/package.json` は次のようになるはずです。

```json
{
  "name": "functions",
  "scripts": {
    "lint": "eslint --ext .js,.ts .",
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "14"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^9.8.0",
    "firebase-functions": "^3.14.1",
    "nuxt": "^2.15.7"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^3.9.1",
    "@typescript-eslint/parser": "^3.8.0",
    "eslint": "^7.6.0",
    "eslint-config-google": "^0.14.0",
    "eslint-plugin-import": "^2.22.0",
    "firebase-functions-test": "^0.2.0",
    "typescript": "^3.8.0"
  },
  "private": true
}
```

`functions/src/index.ts` に Nuxt.js アプリをレンダリングするための HTTP 関数を定義します。

ここで注意したいのは、次の公式のドキュメント

[Cloud Functions を使用した動的コンテンツの配信とマイクロサービスのホスティング](https://firebase.google.com/docs/hosting/functions?hl=ja)

で

> 重要: Firebase Hosting は、us-central1 でのみ Cloud Functions をサポートします。

と説明されているように、リージョンに東京の `asia-northeast1` などを選択することはできないようなので気をつけて下さい。

`buildDir: 'nuxt'` と書いているのは、後でデプロイ設定を書くときに分かりますが、`functions/nuxt` ディレクトリに、Nuxt.js のビルドした成果物をコピーしてくるためです。

```ts
import * as functions from 'firebase-functions';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Nuxt} from 'nuxt';

const nuxt = new Nuxt({
  dev: false,
  debug: false,
  buildDir: 'nuxt',
});

export const nuxt-app = functions
    .https.onRequest(async (request, response) => {
      await nuxt.ready();
      nuxt.render(request, response);
    });
```

TypeScript で Functions を書いた場合には、ビルドコマンドを実行して、JavaScript ファイルに都度コンパイルします。

```shell
npm run build
```

`import {Nuxt} from 'nuxt';` の部分で Lint が次のような警告を出してしまいます。

> Could not find a declaration file for module 'nuxt'. '/path-to-working-dir/nuxt-js-ssr-firebase-hosting/functions/node_modules/nuxt/dist/nuxt.js' implicitly has an 'any' type.

`.eslintrc.js` にルールを加えるなどして対応するか、次の Issue の議論を参考にするなどして対応して下さい。少しかっこ悪いのですが、今回は ignore コメントを追加して対応することにしました。

また、`functions/.eslintrc.js` が

> Parsing error: Cannot read file '/path-to-working-dir/nuxt-js-ssr-firebase-hosting/tsconfig.json'.

という警告を出しています。警告を見ると、本来 `functions` ディレクトリの中に認識されるべき `tsconfig.json` が正しく認識されていないようなので、`functions/.eslintrc.js` の `parserOptions` を次のように設定し直します。

```js
parserOptions: {
  project: ["functions/tsconfig.json", "functions/tsconfig.dev.json"],
  sourceType: "module",
},
```

これで、Functions の設定・記述も完了しました。最後にルートディレクトリに戻って、Functions および Hosting のデプロイ設定をして、実際にデプロイすれば作業完了です。

```shell
cd ..
ls
firebase.json  functions/     nuxt-app/      public/
```

`firebase.json` を次のように編集します。

```json
{
  "functions": {
    "source": "functions",
    "predeploy": [
      "npm --prefix nuxt-app run build && rm -rf functions/nuxt && cp -r nuxt-app/.nuxt/ functions/nuxt/"
    ]
  },
  "hosting": {
    "predeploy": [
      "rm -rf public/* && mkdir -p public/_nuxt && cp -r nuxt-app/.nuxt/dist/client/ public/_nuxt && cp -a nuxt-app/static/. public/"
    ],
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "function": "nuxtApp"
      }
    ]
  }
}
```

functions, hosting の `predeploy` の内容を見るとやっていることはよく分かると思います。

デプロイ時に、functions では、

`nuxt-app` の Nuxt.js アプリをビルドして、その `nuxt-app/.nuxt` ディレクトリの成果物を `functions` ディレクトリの中に `functions/nuxt` ディレクトリを作ってコピーします。

hosting の方では、

ルートの `public` ディレクトリに、`public/_nuxt` ディレクトリに、`nuxt-app` の成果物のクライアントディレクトリ `nuxt-app/.nuxt/dist/client` をコピーしつつ、その他の静的ファイルを配置している `nuxt-app/static` ディレクトリもコピーして追加します。

また、重要なのが hosting の rewrites ルールです。下記のように、Hosting のすべてのリソースパスを、Functions の `nuxtApp` 関数に返すよう設定しているということです。

```json
"hosting": {
  "rewrites": [
    {
      "source": "**",
      "function": "nuxtApp"
    }
  ]
}
```

つまり、このような `predeploy` スクリプトを書いておくことで、ルートで `firebase deploy` コマンドを実行するだけでよしなに必要なタスクがすべて行われます。

`firebase login` や `firebase login --reauth` だけは途中で求められることがあり、デプロイスクリプトが途中で止まると面倒なので予めやっておくことをオススメします。

```shell
firebase deploy
```

でデプロイがうまく行っていれば作業はすべて完了です。Firebase Hosting の URL にアクセスして（Functions の HTTP 関数によって Nuxt.js のレンダリング関数を返す処理を通じて）Nuxt.js のサイトが正しく表示されることを確認してください。

ちなみにこのサイトは、Nuxt.js の SSG の成果物を Netlify で静的ホスティングしています。
