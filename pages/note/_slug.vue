<template>
  <div>
    <ArticleBody :article="article" :next="next" :previous="previous" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArticleBody from '~/components/ArticleBody.vue'

@Component({
  scrollToTop: true,
  layout: 'article',
  components: {
    ArticleBody,
  },
})
export default class extends Vue {
  async asyncData({ $content, params }: { $content: any; params: any }) {
    const query = $content('note', params.slug)
    const article = await query.fetch()
    const [previous, next] = await $content('note')
      .only(['title', 'slug', 'path'])
      .sortBy('createdAt', 'asc')
      .surround(params.slug)
      .fetch()
    return { article, previous, next }
  }
}
</script>
