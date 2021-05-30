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
    const query = await $content('note').sortBy('createdAt', 'desc')
    const articles = await query.fetch()
    return { articles }
  }
}
</script>
