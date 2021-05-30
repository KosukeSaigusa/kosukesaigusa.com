---
title: 'Firestore Security Rules の書き方と守るべき原則'
description: ''
tags: ['Firebase', 'Firestore']
createdAt: 2020-09-21
slug: '2020-09-21-firestore-security-rules'
---

### 概要と投稿の背景

本投稿では、下記の参考にした記事や動画を通じて私が学習した、Firestore Security Rules の書き方と守るべき原則についてまとめます。

まず、そのような学習に有益な情報をオープンに発信して下さっているディベロッパー・クリエイター、Google 公式の皆さんへのリスペクトと感謝を表明します。本当にありがとうございます。

私と同じ学習者の方の参考になればと思い、具体的なユースケースを想定しながら、実際のコードを含む形でまとめています。

### 参考にした記事や動画

本記事では、以下のような記事や動画を通じて学んだ内容をまとめています。

- [【公式】Firebase CLI リファレンス](https://firebase.google.com/docs/cli?hl=ja#mac-linux-auto-script)
- [【公式】Cloud Firestore セキュリティ ルールを構造化する](https://firebase.google.com/docs/firestore/security/rules-structure?hl=ja)
- [【公式】Cloud Firestore セキュリティ ルールの条件の記述](https://firebase.google.com/docs/firestore/security/rules-conditions?hl=ja#data_validation)
- [【公式】Firebase 公式の YouTube チャンネル](https://www.youtube.com/watch?v=VDulvfBpzZE&ab_channel=Firebase)
- [【YouTube】moga さんの YouTube 動画](https://www.youtube.com/watch?v=fHFoqJpkbJg&ab_channel=moga%E3%81%AE%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E9%96%8B%E7%99%BA%E7%A0%94%E7%A9%B6%E6%89%80)
- [【ブログ】su-tech blog](https://tech-blog.sgr-ksmt.org/2018/12/11/194022/)

### 前提

本記事では、

- ローカルマシンでの Firebase CLI の環境設定
- 作業用ディレクトリ（記事内では、`firebase`というディレクトリと、その直下に `test` というディレクトリがあることを想定しています）の作成

が済んでいることを前提としています。この [Github プロジェクトの README](https://github.com/KosukeSaigusa/recipe-app/tree/main/firebase) には、Docker を用いたローカルマシンでの Firebase CLI の環境設定に関する説明も行っていますので、環境設定がまだの方は参考にして下さい。

また、Visual Studio Code の [Firebase](https://marketplace.visualstudio.com/items?itemName=toba.vsfire) というプラグインがルールの記述に役に立つので、事前にインストールすることをおすすめします。

### ルールの基本的な記述方法

`firebase` ディレクトリで、`firebase init` を実行し、Firestore Security Rules を記述する準備を済ませた段階で、下記のようなファイルが生成されていることを確認して下さい。

- `.firebasesec`
- `.gitignore`
- `firebase.json`
- `firestore.indexes.json`
- `firestore.rules`

ルールは、`firestore.rules` というファイルに書いていきます。

`firestore.rules` には、下記のような内容が記述されているでしょう。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        allow read, write: false;
  }
}
```

冒頭の

```js
rules_version = '2'
```

は、2019 年 5 月以降に利用可能になった、Cloud Firestore セキュリティルールの新しいバージョンである趣旨の説明が「[【公式】Cloud Firestore セキュリティ ルールを使ってみる](https://firebase.google.com/docs/firestore/security/get-started?hl=ja)」に記されています。必要なおまじないだと思って、そのまま記述しておきましょう。

ルール全体を取り囲む下記の内容も、必須のおまじないだと認識して問題ありません。`match /databases/{database}/documents` は、対象の Cloud Firestore のデータベースのルートを表しており、下記のコメントアウトの部分に、ルールを書いていくことになります。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        // ここにルール（ホワイトリスト形式）を書いていく
  }
}
```

ルールは、`read` (`get`, `list` に分類される）と `write` (`create`, `update`, `delete` に分類される）のそれぞれのオペレーションをひとつひとつ条件付きで許可していくホワイトリスト形式で書いていきます。つまり、何も書かなければ何の読み書きオペレーションも行えないということで、アプリケーションに必要となる読み書きオペレーションを許可するためのルールを、ユースケースを吟味しながら必要な分だけ書いていく（ルールを書く度にセキュリティに穴を開けることになるとも言える）ことになります。

ルールの基本的な書き方は、

```js
allow <許可する読み書きのオペレーション>: if <許可する条件>;
```

であり「Firestore のどのコレクション、どのドキュメントに対する読み書きか」という情報である

```js
match /<対象のコレクション・ドキュメントへのパス> {
  // ここにルールを記述する
}
```

という記述と合わせて、次のようになります。

```js
match /<some_path>/ {
    allow read, write: if <some_condition>;
}
```

したがって、すべての Firestore 内のすべてのデータに、すべての読み書きを許可するルールは下記の通りになります。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /{document=**} {
            allow read, write: if true;
        }
    }
}
```

**しかし、このようなルールは当然セキュリティ的に問題なので、絶対にこのような内容を本番環境に書いてはいけません。**

というのは、`{document=**}` のワイルドカード表記によって、データベース全体の任意のドキュメントを対象に、`allow read, write: if true;` つまり、すべての読み書きを許可している、ということであるためです。

逆に、すべての読み書きを、いかなる条件でも許さないという記述は、

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if false;
        }
    }
}
```

となります。

たとえば、データベース全体の任意のドキュメントに対し、サインインしているユーザー、つまり、ユーザー ID が `null` でない場合には読み書きを許可するというルールは、下記のような記述となります（これも安全な記述ではないので、学習の参考とするのは構いませんが、本番環境には採用すべきでありません）。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /{document=**} {
            allow read, write: if request.auth.uid != null;
        }
    }
}
```

`request` は、本記事のルールの記述の中にも何度も現れますが、ルールの記述のどこからでもアクセスできる（グローバルに定義されている）値です。下記のような変数

- `request.auth`：ユーザーの認証情報に関する値が参照できる
- `request.resource.data`：クライアントから送られてくるフィールドとその値が参照できる
- `resource.data`：ドキュメントに格納されているフィールドとその値が参照できる

は頻出するので、覚えておきましょう。

### ルールの記述に関する知識と守るべき原則

本番環境にリリースするようなアプリケーションにおいてその Security Rules は、アプリケーションに想定されるユースケースに対して、ホワイトリスト的に、適切な条件下でのみ、最低限の読み書き操作を許可する内容でなければなりません。上でも述べた通り、ルール（`allow <読み書きのオペレーション>: if <許可する条件>;`）を書くということは、**セキュリティに穴をひとつずつ開けていくことに等しい**と認識しておく必要があるということです。

たとえ、クライアント側で適切な権限モデルやビジネスロジック・データのバリデーションが実装されていたとしても、意図していなかったユースケースや悪意のあるユーザーによって、意図していないリクエストをサーバに送れば、たとえば、

- 本人以外のユーザーの個人情報を含む `users` テーブルへアクセスできてしまう
- 予期していない値が Firestore に追加・更新されてバグが発生してしまう
- 削除されるべきでない値が削除されてしまう

といった問題が起こる可能性があります。このことを理解すると、Firestore Security Rules についてきちんと学んでおく必要性が理解できるはずです。

また、ルールの記述に際して最低限守るべき原則のひとつとして**「`allow write` は、絶対に書いてはいけない」**というのがあります。

Firestore Security Rules において、`read`, `write` のオペレーションは、それぞれ、次の読み書き操作を含んでいます。

- read
  - get：単一のドキュメントの取得
  - list：クエリによるコレクション・複数ドキュメントの取得
- write
  - create：ドキュメントの生成
  - update：ドキュメントの一部のフィールドの更新
  - delete：ドキュメントの削除

`allow write` と書くことが許されないのは、`create` や `update` のルールを `delete` と同一の条件で記述することになってしまうのが理由です。`delete` には、`create` や `update` でクライアントから送信されてくるフィールドとその値を検証するための `request.resource.data` が扱えず、データの構造や内容を検証した上でのバリデーションを行うことができません。そのため、`create` や `update` のオペレーションを、データの構造や内容に対する検証を一切行わずに許可する挙動を引き起こすこととなり、安全なセキュリティルールを確立できないことを意味してしまいます。また、`create` と `update` すらも、ルールを区別することを怠って全く同一の条件で許可するケースはほぼない、と認識しておきましょう。

### 具体的なアプリケーションを想定したルールの記述

本記事では、より実践的な内容を含めるために、具体的なアプリケーションとそのユースケースの一部を想定して話を進めます。

今回は、家計簿アプリに必要な Security Rules を考えることとしましょう。

この家計簿アプリは、ざっくりと、

- 各ユーザーが自身のアカウントでログインして使用する
- 支出は各ユーザーにひも付き、記録していく
- ユーザーデータや支出データを他人に公開することはない

という想定にして、そのデータベースの構造、つまり Firestore のコレクションやドキュメント、各ドキュメントが保持するフィールドは、次の通りとします。

```yaml
{
  users: {  # /users コレクション
    {userId}: {  # /users/{userId} ドキュメント
      "createdAt": timestamp,
      "email": string,
      "userId": string,

      expenses: {  # /users/{userId}/expenses コレクション
        {expenseId}: {  # /users/{userId}/expenses/{expenseId} ドキュメント
          "createdAt": timestamp,
          "content": string,
          "price": int
        }
      }
    }
  }
}
```

少し補足で説明すると、

- データベースのルートに、`users` というコレクションを定義し、その中に 各ユーザーのユーザー ID に一致するドキュメント ID を用いた `users/{userId}/` というパスでユーザードキュメントを定義する
- `users` コレクションの下に、各ユーザーに支出データは属するという意味合いで、`expenses` というコレクションを定義し、`users/{userId}/expenses/{expenseId}/` というパスで、支出データのドキュメントを定義する
- ユーザーデータとして保持するフィールドは、それぞれ、データ作成日時、メールアドレス、ユーザー ID を意味する `createdAt`, `email`, `userId` とする
- 家計簿に登録される支出データは、それぞれ、データ作成日時、支出の内容、値段を意味する `createdAt`, `content`, `price` は保存する

という状況です。

説明のために、実在しそうな家計簿アプリよりは簡単な状況を想定していますが、実践的ないろいろなアプリケーションのデータ構造もこれに似た形になっているでしょう。

それでは、具体的なユースケースを考えながら、ルールを記述していきます。

#### 例）自身のユーザーデータを参照するユースケース

まず、ユーザーがアプリケーション内のマイページのような画面で、自身のユーザーデータを参照するようなユースケースを想定したルールを記述することにしましょう。

そのような操作が許可されるユーザーが満たすべき条件は、

1. Firebase Auth での何らかの認証（メールアドレスとパスワードによる認証や、各種 SNS などの外部サービスなどによる認証）が行われていること、つまり、ユーザーのアプリケーションへのログインが済んでいること
2. ユーザーデータの取得を行うユーザーのユーザー ID が、要求しているユーザードキュメントのドキュメント ID に一致していること

のようになるはずです。

特に 2 点目を外してしまうと、予期しない使われ方をされたときに、他人のユーザー情報を取得するリクエストが許可されてしまうことになってしまいます。

そのルールは次のように記述できます。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{userId} {
            allow get: request.auth != null // 条件 1
            && userId == request.auth.uid; // 条件 2
        }
    }
}
```

このように、`/users` コレクション下の任意のユーザードキュメントへのパスは、`/users/{userId}` のように表現でき、そこで記述するルール内で、`userId` という値を用いることができます。

```js
match /users/{userId} {
    // ここでは、userId（各ユーザードキュメントのドキュメント ID） の値が使用できる
}
```

`read` オペレーションが含む `get` と `list` は、`write` オペレーションと異なり、それほど神経質に区別する必要がない場合もありますが、今回はマイページから参照するユーザードキュメントは明らかに自分自身のひとつだけなので、`get` でルールを書いておきました。つまり、`/users` コレクションから複数のユーザーデータを取得するようなクエリは許されません。

また、私自身、[【YouTube】moga さんの YouTube 動画](https://www.youtube.com/watch?v=fHFoqJpkbJg&ab_channel=moga%E3%81%AE%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E9%96%8B%E7%99%BA%E7%A0%94%E7%A9%B6%E6%89%80) やから学んだことですが、ルールの記述に必要な汎用的な表現は、ルールの外側に関数として切り出して定義しておいて、必要な場合に呼び出すようにすれば、すっきりと効率的にルールが書けるので役に立ちます。

そこで、上の 1, 2 の条件を、moga さんの解説にならって、それぞれ `isAuthenticated`（「何らかの認証が済んでいる」という意味合い） と `isUserAuthenficated`（「ユーザー ID も含めて、適切な者であるという認可」という意味合い）という関数名で、次のように切り出して記述しておきました。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {

        // 切り出した関数の記述
        function isAuthenticated() { // 条件 1
            return request.auth != null;
        }

        function isUserAuthenticated(userId) { // 条件 1 かつ 条件 2
            return isAuthenticated() && userId == request.auth.uid;
        }

        // ルールの記述
        match /users/{userId} {
            // ユーザー情報の取得のルール
            allow get: if isUserAuthenticated(userId); // 条件 1 かつ 条件 2
        }
    }
}
```

#### 例）ユーザーの新規登録時の、ユーザーデータの作成のユースケース

次に、ユーザーの新規登録時の、ユーザーデータの作成の（Firestore の `add` や `set` に相当する）ユースケースについて考えていきます。

本人以外にそのアカウントの作成を許可する訳にはいかないので、上と同様の本人による認証が必要となります。

加えて、今度は**スキーマ検証**と、**データのバリデーション**についても考える必要があるので説明します。

**スキーマ検証**とは、読み書きするデータの構造や種類に関する検証のことです。Firestore は、スキーマレスなデータベース（通常のデータベースで言う列などが定義されていない）のため、たとえば、意図していない余計なフィールドをもつドキュメントが作成されたり、逆に保存されるべきフィールドが欠損したものが保存されたりしてしまうような現象が発生し、アプリケーションの不具合に繋がる可能性があるので、その検証が必要となります。

**データのバリデーション**とは、クライアントから送信されてきた値が、各フィールドに設定されるのに適切なものかどうかを判断するステップのことです。たとえば、支出の価格フィールドに、負の値や小数点型の値、その他価格として不適切な値が入力されることは、クライアント側でのバリデーションだけでは不十分で、ルールで防いでおくべきです。

たとえクライアント側の UI で適切に入力フォームを設定し、入力フォームの内容に対してバリデーションを（例：「価格には正の整数値を入力して下さい」というエラーメッセージとともに、価格フィールドへの正の整数値以外の値の入力を弾くような内容）を実装したつもりでも、予期していない値がサーバに送られる可能性は否定できません。

そのため、スキーマ検証とデータのバリデーションも、Firestore Security Rules でチェックすべき大切な要素です。

今回想定している家計簿アプリにおいて、ユーザーの新規登録時の、ユーザーデータの作成のユースケースとして考慮すべきポイントには、次のような内容があるでしょう。

1. ユーザーから送信されるデータ（フィールド）の数は、ちょうど 3 つである
2. その 3 つのフィールドは、`created At`, `email`, `userId` の 3 つである
3. ユーザーデータとして送信されてくる値は、それぞれ意図した型（順に、timestamp, string, string）と一致している
4. `createdAt` として送信されてくる値は、そのサーバタイムスタンプの値と一致している
5. `userId` として送信されてくる値は、その値を書き込むユーザードキュメントの ドキュメント ID に一致している

冗長なところや突っ込みどころのある箇所も含まれるかもしれません。厳密にしようとすれば、たとえば、

- `email` として送信されてくる値は、メールアドレスとして適切な形式である（正規表現を用いてバリデーションする）
- string 型として送信されてくる `email` の値は、文字数が所定の長さ以下である（不適切に長い文字列は拒否する）

のような条件も思いつきますが、今回は簡単のために上記の 5 点でルールを組みます。例によって、コードの読みやすさとメンテナンサビリティを考慮して、新たに、ユーザーデータがもつべきフィールドのスキーマ検証を行うための `isValidUser` という関数を定義して、次のように書きました。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {

        function isAuthenticated() {
            return request.auth != null;
        }

        function isUserAuthenticated(userId) {
            return isAuthenticated() && userId == request.auth.uid;
        }

        // ユーザーデータのスキーマ検証
        function isValidUser(user) {
            return user.size() == 3
            && 'createdAt' in user && user.createdAt is timestamp
            && 'email' in user && user.email is string
            && 'userId' in user && user.userId is string;
        }

        // ルールの記述
        match /users/{userId} {

            // ユーザー情報の取得のルール
            allow get: if isUserAuthenticated(userId);

            // ユーザー情報の作成のルール
            allow create: if isUserAuthenticated(userId)
            // スキーマ検証
            && isValidUser(request.resource.data)
            // データのバリデーション
            && request.resource.data.createdAt == request.time
            && request.resource.data.userId == userId;
        }
    }
}
```

解説を加えると、

条件 1：ユーザーから送信されるデータ（フィールド）の数がはちょうど 3 つである

```js
return request.resource.data.size() == 3
```

条件 2：その 3 つのフィールドは、`created At`, `email`, `userId` の 3 つである（つまり、条件 1 と合わせて、`request.resource.data` に 3 つのフィールドが存在することが言えれば同値な条件である）

```js
'createdAt' in request.resource.data &&
  'email' in request.resource.data &&
  'userId' in request.resource.data
```

条件 3：ユーザーデータとして送信されてくる値は、それぞれ意図した型（順に、timestamp, string, string）と一致している

```js
request.resource.data.createdAt is timestamp && request.resource.data.email is string && request.resource.data.userId is string;
```

条件 4：`createdAt` として送信されてくる値は、そのサーバタイムスタンプの値と一致している

```js
request.resource.data.createdAt == request.time
```

条件 5：`userId` として送信されてくる値は、その値を書き込むユーザードキュメントの ドキュメント ID に一致している

```js
 match /users/{userId} {
    // 省略
    request.resource.data.userId == userId;
}
```

ということです。

`/users` コレクションに関しては、他にも、

- マイページから、登録しているメールアドレスを変更する
- アプリケーションの利用終了時に、アカウントを破棄する

のようなユースケースで、`update` や `delete` に関するオペレーションも考えられますが今回は省略して、家計簿アプリの支出データを取り扱う `/users/{userId}/expenses` コレクションに話題を移します。

#### 例）支出データの取得・追加・更新・削除のユースケース

`/users/{userId}/expenses` コレクションは、`/users` コレクションの各ユーザーデータの配下に保存されるので、その階層構造を反映させて、`/users/{userId}/expenses` に関するルールは、次の位置に記述していけば良いことになります。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{userId} {
            match /expenses/{expenseId} {
                // expenses コレクションのルールはここに記述する
            }
        }
    }
}
```

想定している家計簿アプリの支出データの取得・追加・更新・削除には、大雑把に、次のようなユースケースが考えられるでしょう。

- 各ユーザーが自身の支出を、その支出内容 (`content`)、値段 (`price`) とともに入力し（またその際、入力日時 (`createdAt`) も一緒に自動で登録される）、データベースにドキュメントを追加する
- 入力された支出一覧を取得し、アプリケーションのメイン画面で表示する
- アプリケーションのメイン画面で確認できる支出一覧から、特定の支出を選択すると、その支出の登録内容（3 つのフィールドの値）が確認でき、内容 (`content`) や値段 (`price`) を編集して更新することができる。一方で `createdAt` の更新は許さない
- 誤って登録してしまった支出が存在すれば、それを削除することができる

当然、他のユーザーの支出を参照したり、更新・削除することはできない想定なので、下記では本人による認証については逐一言及せずに話を進めます。

まず、自身の支出データの読み取りについては、ここでは `get` と `list` を神経質に区別せずに、

- 参照しようとしている支出データの持ち主は本人である。

というのが、許可する条件と言って良いでしょう。よって、ルールは次のように記述できます。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{userId} {
            match /expenses/{expenseId} {
                // 支出データの読み取りのルール
                allow read: if isUserAuthenticated(userId);
            }
        }
    }
}
```

次に、支出の登録（追加）の `create` オペレーションについて、満たすべき条件を、

- 追加する支出ドキュメントは、`/users` コレクションの本人のユーザードキュメント配下である
- 登録日時 (`createdAt`), 支出の内容 (`content`), 値段 (`price`) の 3 つのフィールドを正しく受け取っている
- 各フィールドの型は、それぞれ、timestamp, string, int である
- `createdAt` の値は、サーバのタイムスタンプと一致している
- 支出内容 (`content`) の文字列は、0 文字以上 100 文字以内であり、支出の値段 (`price`) は、0 円以上 100 万円以下である
- `userId` として送信されてくる値は、その値を書き込むユーザードキュメントの ドキュメント ID に一致している

としておきます。すると、ルールは次のように記述できます（`isValidExpense` という関数を新たに定義しています）。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{userId} {

            // 支出データのスキーマ検証
            function isValidExpense(expense) {
                return expense.size() == 3
                && 'createdAt' in expense && expense.createdAt is timestamp
                && 'content' in expense && expense.content is string
                && 'price' in expense && expense.price is int;
            }

            match /expenses/{expenseId} {
                // 支出データの作成のルール
                allow create: if isUserAuthenticated(userId)
                // スキーマ検証
                && isValidExpense(request.source.data)
                // データのバリデーション
                && request.resource.data.createdAt == request.time
                && (request.resource.data.content.size() > 0
                && request.resource.data.content.size() < 100
                )
                && (request.resource.data.price > 0
                && request.resource.data.price < 1000000
                );
            }
        }
    }
}
```

支出の編集（更新）の `update` オペレーションについては、`create` オペレーションと類似のルールとなることはすぐに分かりますが、必ずしもすべてのフィールドが更新されるわけではありません。しかし、`request.resource` には、最終的に Firestore に保存されるすべてのフィールドが設定されることに注意しましょう（よって `request.resource.data.size() == 3` の条件はかわらず必要です）。次のような条件を考えれば良いでしょう。

- `create` オペレーションとほぼ同一のルールを適用する。
- `createdAt` は更新させない想定なので、`createdAt` はもともと Firestore に保存されていた値 (`resource.data.createdAt`) と、`update` オペレーションによって送られてきた値 (`request.resource.data.createdAt`) が一致している。

という条件でルールを記述することにします（`isValidExpenseUpdate` という function を新たに定義しています）。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{userId} {

            // 支出データのスキーマ検証
            function isValidExpense(expense) {
                return expense.size() == 3
                && 'createdAt' in expense && expense.createdAt is timestamp
                && 'content' in expense && expense.content is string
                && 'price' in expense && expense.price is int;
            }

            match /expenses/{expenseId} {
                // 支出データの更新のルール
                allow update: if isUserAuthenticated(userId)
                // スキーマ検証
                && isValidExpense(request.resource.data)
                // データのバリデーション
                && (request.resource.data.content.size() > 0
                && request.resource.data.content.size() < 100
                )
                && (request.resource.data.price > 0
                && request.resource.data.price < 1000000
                )
                && request.resource.data.createdAt == resource.data.createdAt;
            }
        }
    }
}
```

最後に、`delete` オペレーションについては、

- 支出ドキュメントを削除できるのは、そのドキュメントの所有者本人のみである

ことが条件なので、シンプルに次のようになります。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{userId} {
            match /expenses/{expenseId} {
                // 支出データの削除のルール
                allow delete: if isUserAuthenticated(userId);
            }
        }
    }
}
```

### まとめ

以上、ここまでに記述したすべてのルールを整理すると次の通りとなります。

```js
rules_version = '2';

service cloud.firestore {
    match /databases/{database}/documents {

        // サインインの認証
        function isAuthenticated() {
            return request.auth != null;
        }

        // 本人の認証
        function isUserAuthenticated(userId) {
            return isAuthenticated() && userId == request.auth.uid;
        }

        // ユーザーデータのスキーマ検証
        function isValidUser(user) {
            return user.size() == 3
            && 'createdAt' in user && user.createdAt is timestamp
            && 'email' in user && user.email is string
            && 'userId' in user && user.userId is string;
        }

        // 支出データのスキーマ検証
        function isValidExpense(expense) {
            return expense.size() == 3
            && 'createdAt' in expense && expense.createdAt is timestamp
            && 'content' in expense && expense.content is string
            && 'price' in expense && expense.price is int;
        }

        match /users/{userId} {

            // ユーザー情報の取得のルール
            allow get: if isUserAuthenticated(userId);

            // ユーザー情報の作成のルール
            allow create: if isUserAuthenticated(userId)
            && isValidUser(request.resource.data)
            && request.resource.data.createdAt == request.time
            && request.resource.data.userId == userId;

            match /expenses/{expenseId} {

                // 支出データの読み取りのルール
                allow read: if isUserAuthenticated(userId);

                // 支出データの作成のルール
                allow create: if isUserAuthenticated(userId)
                && isValidExpense(request.source.data)
                && request.resource.data.createdAt == request.time
                && (request.resource.data.content.size() > 0
                && request.resource.data.content.size() < 100
                )
                && (request.resource.data.price > 0
                && request.resource.data.price < 1000000
                );

                // 支出データの更新のルール
                allow update: if isUserAuthenticated(userId)
                && isValidExpense(request.resource.data)
                && (request.resource.data.content.size() > 0
                && request.resource.data.content.size() < 100
                )
                && (request.resource.data.price > 0
                && request.resource.data.price < 1000000
                )
                && request.resource.data.createdAt == resource.data.createdAt;

                // 支出データの削除のルール
                allow delete: if isUserAuthenticated(userId);

            }
        }
    }
}
```

### 最後に

「Firestore Security Rules の書き方と守るべき原則」と題した記事内容は以上です。

不明点や誤りを見つけた際にはお知らせ下さいますと幸いです。

- ローカルマシンでの Firebase CLI の環境設定
- Firestore Security Rules の ユニットテスト

などについても日を改めて投稿してみたいと思っているのでよろしくお願いします。
