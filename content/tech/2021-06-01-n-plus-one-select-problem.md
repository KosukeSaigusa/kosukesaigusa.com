---
title: 'Django ORM で N + 1 問題 を回避する'
description: 'N + 1 問題についてのメモと Django の ORM でそれを回避する方法'
tags: ['SQL', 'Django', 'Python']
createdAt: 2021-06-01
slug: '2021-06-01-n-plus-one-select-problem'
---

### はじめに

この記事では、N + 1 問題について、備忘の目的で記録をします。

それに当たって参考にしたサイトは次のようなものです。このような情報を書き残して下さった皆さんに感謝します。

- [https://qiita.com/massaaaaan/items/4eb770f20e636f7a1361](https://qiita.com/massaaaaan/items/4eb770f20e636f7a1361)
- [https://qiita.com/muroya2355/items/d4eecbe722a8ddb2568b](https://qiita.com/muroya2355/items/d4eecbe722a8ddb2568b)
- [https://www.techscore.com/blog/2012/12/25/rails ライブラリ紹介-n1 問題を検出する「bullet」/](https://www.techscore.com/blog/2012/12/25/rails%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E7%B4%B9%E4%BB%8B-n1%E5%95%8F%E9%A1%8C%E3%82%92%E6%A4%9C%E5%87%BA%E3%81%99%E3%82%8B%E3%80%8Cbullet%E3%80%8D/)
- [https://qiita.com/hisonl/items/763b9d6d4e90b1606635](https://qiita.com/hisonl/items/763b9d6d4e90b1606635)

### N + 1 問題とは

N+1 問題とは、ORM を使用しているときに発生しがちな問題で、

- あるテーブルから、一覧に表示する N 件のレコードを取得するために SELECT を 1 回実行
- 別のテーブルから、上で取得した N 件のレコードに紐づくデータを取得するために SELECT を各 1 回、つまり 合計 N 回実行

するために、総計 N + 1 回のクエリを実行する状態を言う（順番的には「1 + N 問題」といった方が適切かもしれない）。

### Django で N + 1 問題を回避する方法

例えば、次のような Django モデルを考える。

```py
from django.db import models

class Prefecture(models.Model):
  """
  都道府県テーブル
  """

	class Meta:
		db_table = 'prefecture'

	name = models.CharField(
		verbose_name='都道府県名'
	)

class Shop(models.Model):
	"""
	店舗テーブル
	"""

	class Meta:
		db_table = 'shop'

	name = models.CharField(
		verbose_name='店舗名'
	)
	prefecture = models.ForeignKey(
		Prefecture, on_delete=models.PROTECT,
	)
```

ここで、店舗一覧を取得し、その店舗の所在地の都道府県を表示するようなユースケースがあるとき、Django の ORM で次のような書き方をすると N + 1 問題が発生する。

```py
from models import Prefecture, Shop

queryset = Shop.Objects.all()

for shop in queryset:
	print(f'店舗名：{shop.name} (所在地：{shop.prefecture.name})')
```

つまり、店舗一覧のデータを取得して（1 回）、その所在地の都道府県を取得するために、それぞれの店舗に対して毎回（N 回）次のようなクエリが発行されていることになる。

```sql
SELECT * FROM prefectures WHERE prefectures.id = {shop.prefecture.id};
```

生の SQL を書くとすれば、次のように予め都道府県テーブルと店舗テーブルを結合しておけば良い。

```SQL
SELECT * FROM shop
INNER JOIN prefecture
	ON shop.prefecture = prefecture.id;
```

この例において Django の ORM で N + 1 問題を回避するためには、 select_related() の記述を追加する。

```py
from models import Prefecture, Shop

queryset = Shop.Objects.all().select_related('prefecture')

for shop in queryset:
	print(f'店舗名：{shop.name} (所在地：{shop.prefecture.name})')
```

このようにすることで、queryset からクエリが発行される際に、 `select_related()` で指定した外部キーのテーブルが JOIN されるようになって、クエリの発行回数が 1 回で済むようになる。
