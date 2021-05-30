<template>
  <div>
    <ArticleContent :article="article" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BreadCrumbList from '~/components/BreadCrumbList.vue'
import ArticleConent from '~/components/ArticleContent.vue'

@Component({
  scrollToTop: true,
  layout: 'article',
  components: {
    BreadCrumbList,
    ArticleConent,
  },
})
export default class extends Vue {
  async asyncData({ $content, params }: { $content: any; params: any }) {
    const query = $content('note', params.slug)
    const article = await query.fetch()
    return { article }
  }
}
</script>
