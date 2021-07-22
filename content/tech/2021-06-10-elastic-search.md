---
title: 'Elasticsearch の基本'
description: 'Elasticsearch に関する基礎知識のメモ'
tags: ['Elasticsearch']
createdAt: 2021-06-10
slug: '2021-06-10-elastic-search'
---

### Elasticsearch に関する基礎知識のメモ

Elasticsearch とは、Elastic 社が開発している、Lucene（ルシーン）をベースとする OSS の分散型、無料、かつオープンな検索・分析エンジンとのこと。REST でもアクセス可能で、全文検索に強く、検索エンジンの中では最も有名なもののひとつ。

Kibana は、Elasticsearch のデータを分析・可視化するためのツールで、Kibana の Devtools を使用すると、Elasticsearch のクエリを書きやすい。

今回は、仕事で Elasticsearch にクエリを送って得られた結果をいい感じに加工してレスポンスとして整形するような Django の API を作るタスクに関わる中で、はじめて Elasticsearch に触れる機会となったので、作業の中で知った範囲の知識をまとめる。

仕事では、既に Kibana が社内サーバで使用可能で、クエリを投げる index（RDBMS でいう DB）やその他の設定も済んでおり、すぐにクエリを試せる状態だったので、環境構築やその他の基礎知識は [初心者のための Elasticsearch その 1](https://dev.classmethod.jp/articles/es-01/) あたりの記事に任せることにする。

他にも、この公式ドキュメント「[Boolean query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)」や

- [初心者のための Elasticsearch その 2 -いろいろな検索-](https://dev.classmethod.jp/articles/es-02/)
- [Elasticsearch の bool query を利用して AND OR NOT を書いてみる](https://qiita.com/vanhuyz/items/04a6871ae5f53ba5a97f)

などの記事も参考にさせて頂いた。

基本的には、次のようなクエリを書いていく。クエリのソースコードは一行目以外は JSON と同じ形式。公式ドキュメント「[Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)」でも "Elasticsearch provides a full Query DSL (Domain Specific Language) based on JSON to define queries." と書いてある。

すべてのドキュメントを検索するクエリ：

```json
GET /user_index/_search
{
  "query": {
    "match_all": {}
  }
}
```

取得する件数、ソート順を加える次のような感じ：

```json
GET /user_index/_search
{
  "query": {
    "match_all": {}
  },
  "sort" : [
    {"_id": "asc"}
  ]
}
```

取得するフィールドをたとえば `first_name` と `last_name` のみに限定するなら：

```json
GET /user_index/_search
{
  "query": {
    "match_all": {}
  },
  "_source": ["first_name", "last_name"],
  "sort" : [
    {"_id": "asc"}
  ]
}
```

カテゴリーを "japanese" に限定するのを必須とするなら（例として、レストランデータの DB を検索する想定）：

```json
GET /user_index/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "category": "japanese"
          }
        }
      ]
    }
  },
  "sort" : [
    {"_id": "asc"}
  ]
}
```

日本料理かつクレジットカード OK のレストランを検索するなら：

```json
GET /user_index/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "category": "japanese"
          },
          "term": {
            "card_ok": 1
          }
        }
      ]
    }
  },
  "sort" : [
    {"_id": "asc"}
  ]
}
```

日本料理かつ、団体 OK または少々騒いでも大丈夫なレストランを探すなら：

```json
GET /user_index/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "category": "japanese"
          },
        },
        {
          "bool": {
            "filter": [
              {
                "bool": {
                  "should": [
                    {
                        "term": {
                        "group_ok": 1
                      }
                    },
                    {
                        "term": {
                        "noisy_ok": 1
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  },
  "sort" : [
    {"_id": "asc"}
  ]
}
```

店名を「天ぷら」で全文検索するなら：

```json
GET /user_index/_search
{
  "query": {
    "match": {
      "name": "天ぷら"
    }
  },
  "sort" : [
    {"_id": "asc"}
  ]
}
```

予算が 5,000 円以上 10,000 円未満 で探すなら：

```json
GET /user_index/_search
{
  "query": {
    "bool": {
      "must": [],
      "filter": {
        "range": {
          "budget": {
            "gte": 5000,
            "lt": 10000
          }
        }
      }
    }
  },
  "sort" : [
    {"_id": "asc"}
  ]
}
```
