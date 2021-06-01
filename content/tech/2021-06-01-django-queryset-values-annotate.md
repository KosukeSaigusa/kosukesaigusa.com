---
title: 'Django の QuerySet で COUNT の集計結果を filter の条件にする'
description: 'values() と annotate() を用いて、Django の QuerySet で COUNT の集計結果を filter の条件にする方法のメモ'
tags: ['Django', 'Python', 'SQL']
createdAt: 2021-06-01
slug: '2021-06-01-django-queryset-values-annotate'
---

### 対象にするデータの例

今回対象とするのは、下記のようなメンバー（人）とタスクのテーブル、それらの関連を表す中間テーブルです。一人のメンバーは複数のタスクを割り当てられることがあり、あるタスクは複数のメンバーに割り当てられることもあるので、メンバーとタスクは Many to Many の関係であると言える。

```python
from django.db import models

class Member(models.Model):
  """
  メンバーテーブル
  """

	class Meta:
		db_table = 'product'

	name = models.CharField(
		verbose_name='氏名'
	)

class Task(model.Model):
	"""
	タスクテーブル
	"""

	class Meta:
		db_table = 'task'

	name = models.CharField(
		verbose_name='タスク名'
	)

class MemberTaskAssignment:
	"""
	どのタスクがどのメンバーに割り当てられているかを示す
	メンバーとタスクとの中間テーブル
	"""

	class Meta:
		db_table = 'member_task_assignment'
    unique_together = [
	    ('member', 'task')
    ]

	member = models.ForeignKey(
		Member, on_delete=models.PROTECT
	)
	task = models.ForeignKey(
		Task, on_delete=models.PROTECT
	)
```

### COUNT 関数でレコードの数を集計する

タスクの一覧を取得する際に、SQL の COUNT 関数で、同じタスクを指しているレコードがいくつ見つかるかも数えたい場合には、次のような SQL を発行することになる。

```sql
SELECT *, COUNT(1) AS count
FROM member_task_assignment
GROUP BY task;
```

この SQL を実行すると、 `GROUP BY` で task を指定しているので、外部キーである task が重複が重複しているレコードがまとめられ、同じタスクを指しているレコードのカウント、つまりこの例では、結果的にそれぞれのタスクに何人のメンバーがアサインされているかという情報を得ることができる。

### COUNT 関数の結果を絞り込みに反映させる

今度は、上で行ったことからひとつステップを進めて、COUNT 関数による重複レコードのカウントの集計結果を絞り込みの条件に活かすということをやってみる。

例としては、同じタスクを指しているレコードのカウントが一定以上、つまりある人数以上のメンバーがアサインされているタスクを抽出するようなユースケースである（実生活にあり得そうな意味で捉えれば、「5 人以上が割り当てられているタスクは大変なものだと判断されるので、そういった大変そうなタスクを抽出して把握したい」というような状況と言えるだろうか）。

SQL を書くならば、今度は `HAVING` を指定して次のようになる。

```sql
SELECT *, COUNT(1) AS count
FROM member_task_assignment
GROUP BY task
HAVING count >= 5;
```

これを Django の ORM で実現しようとするならば、 `annotate()` と `values()` を用いて次のようになる。

```python
queryset = MemberTaskAssignment.objects.values(
						'task'
					).annotate(
						count=Count('task')
					).filter(
						count__gte=5
					)
```

### Django の公式ドキュメントを読んで確認する

ここで、[Django の公式ドキュメントの Aggregation に関する説明の `values()` のセクション](https://docs.djangoproject.com/en/3.2/topics/db/aggregation/#values)を読んでみよう。

> Ordinarily, annotations are generated on a per-object basis - an annotated QuerySet will return one result for each object in the original QuerySet. However, when a values() clause is used to constrain the columns that are returned in the result set, the method for evaluating annotations is slightly different. Instead of returning an annotated result for each result in the original QuerySet, the original results are grouped according to the unique combinations of the fields specified in the values() clause. An annotation is then provided for each unique group; the annotation is computed over all members of the group.
> For example, consider an author query that attempts to find out the average rating of books written by each author:

```python
>>> Author.objects.annotate(average_rating=Avg('book__rating'))
```

> This will return one result for each author in the database, annotated with their average book rating.
> However, the result will be slightly different if you use a values() clause:

```python
>>> Author.objects.values('name').annotate(average_rating=Avg('book__rating'))
```

> In this example, the authors will be grouped by name, so you will only get an annotated result for each unique author name. This means if you have two authors with the same name, their results will be merged into a single result in the output of the query; the average will be computed as the average over the books written by both authors.

つまり、1 つ目の例で `annotate()` が単独で用いられているときには、それぞれの著者オブジェクトの一覧を、その著者の著書のレーティングの平均値と一緒に取得するようなユースケースである。

一方 2 つ目の例では、 `annotate()` に加えて、 `values('name')` が記述されており、SQL でいうところの `GROUP BY name` が発行されることになり、同じ名前の著者が Author テーブルに 2 人いた場合には、それらがグループとしてまとめられ、両者の著書のレーティングの平均値とともに抽出されることになる。
