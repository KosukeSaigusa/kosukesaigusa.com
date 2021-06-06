---
title: 'GitHub Actions で、GitHub Issue を所定のプロジェクトに自動で割り当てる'
description: 'GitHub Actions で、GitHub Issue や PR の作成をトリガーに、所定のプロジェクトに自動で割り当てる方法のメモ。'
tags: ['GitHub Actions']
createdAt: 2021-06-06
slug: '2021-06-06-github-actions-auto-assign-project'
---

### GitHub Issue を所定のプロジェクトに自動で割り当てる

現在勤めている会社では、イシュートラッキングツールとしては [Nulab 社の Backlog](https://nulab.com/products/backlog/) を使用しているが、個人開発や友人とのちょっとしたプロジェクトでは、ソースコードもイシュートラッキングもプロジェクト管理も一箇所で行える GitHub Projects を好んで使っている。

これから友人 NPO 法人で使うアプリケーションの開発のために、同様に GitHub Projects を使おうとしており、私以外の NPO 法人の理事のメンバーは皆エンジニアではないが、開発には関わらなくても、アプリケーションに掲載する画像や文言の選定、利用規約やプライバシーポリシーの作成などは、彼らに割り当ててプロジェクトを進めていく必要がある。

そこで、非エンジニアでも難しいと感じないように、GitHub の Issue テンプレートを用意したりしていたのだが、その作成した Issue が自動で Projects のカンバンに登録されるようにしたいと思うことがあった。

というのも、GitHub Issue のテンプレートから Issue を作成する際に、次の画像の右側の箇所から "Projects" を候補から選択して指定すれば良いだけ、と言えばそれだけなのだが、私自身よくこれを選択するのを忘れて、後でカンバンを見に行ったときに「あれ、さっき作成したはずの Issue がないぞ...。あ、"Projects" を指定するの忘れていたか」となってしまうこともよくあり、非エンジニアのメンバーも同様の混乱を後で起こしてしまうだろうなと予想したので、GitHub Issue のテンプレートのオプションから、デフォルトの Projects を指定する方法を探していた。

![project_setting](/image/news/2021-06-06-github-actions-auto-assign-project/project_setting.png)

が、デフォルトの "Assignees" や "Labels" を選ぶオプションはここから選択できても、"Projects" を指定しておく方法はないようで、知り合いのエンジニアの方が教えてくれた [Feature Request](https://github.community/t/feature-request-allow-to-add-projects-to-the-issue-template/1789/18) の中でのやり取りの内容を見てみると、workaround として、GitHub Actions のワークフローを用いる方法が出てきた。

つまり、Issue の作成や PR の作成をトリガーにワークフローが実行され、予め決めておいたプロジェクトをその Issue や PR に割り当てるというもので、やりたい要件を満たせそうだったので試してみた。

結論、下記のような `.github/workflow/auto_assign_project.yml` ファイルを作成すれば良い。

```
name: Auto Assign to Project(s)
on:
  issues:
    types: [opened]
  pull_request:
    types: [opened]
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
jobs:
  assign_one_project:
    runs-on: ubuntu-latest
    name: Assign to One Project
    steps:
      - name: Issue, PR の作成をトリガーに、所定の Project に割り当てる
        uses: srggrs/assign-one-project-github-action@1.2.1
        if: github.event.action == 'opened'
        with:
          project: '<ここに割り当てたいプロジェクトの URLを記入する。例：https://github.com/srggrs/assign-one-project-github-action/projects/2>'
      - name: Assign all issues and pull requests on this repository to the project
        uses: srggrs/assign-one-project-github-action@1.2.1
        with:
          project: '<ここに割り当てたいプロジェクトの URLを記入する。例：https://github.com/srggrs/assign-one-project-github-action/projects/2>'
          column_name: '<ここに割り当てたいプロジェクトのカラムの名前を記入する。例：To do>'
```
