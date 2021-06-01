<template>
  <div>
    <PostCategoryTabs />
    <ArticleList :articles="articles" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PostCategoryTabs from '~/components/PostCategoryTabs.vue'
import ArticleList from '~/components/ArticleList.vue'

@Component({
  scrollToTop: true,
  layout: 'default',
  components: {
    PostCategoryTabs,
    ArticleList,
  },
})
export default class extends Vue {
  async asyncData({ $content }: { $content: any }) {
    const noteQuery = await $content('note').sortBy('createdAt', 'desc')
    const noteArticles = await noteQuery.fetch()
    const techQuery = await $content('tech').sortBy('createdAt', 'desc')
    const techArticles = await techQuery.fetch()
    const articles = noteArticles.concat(techArticles)
    // TODO: any 型をやめる
    articles.sort(function (a: any, b: any) {
      if (a.createdAt < b.createdAt) {
        return 1
      } else {
        return -1
      }
    })
    return { articles }
  }
}
</script>
