<template>
  <div>
    <ArticleContent :article="article" />
    <div class="flex gap-x-4 md:gap-x-8">
      <div class="flex-1">
        <div v-if="next != null"><NextArticle :next="next" /></div>
      </div>
      <div class="flex-1">
        <div v-if="previous != null">
          <PreviousArticle :previous="previous" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BreadCrumbList from '~/components/BreadCrumbList.vue'
import ArticleConent from '~/components/ArticleContent.vue'
import NextArticle from '~/components/NextArticle.vue'
import PreviousArticle from '~/components/PreviousArticle.vue'

@Component({
  scrollToTop: true,
  layout: 'article',
  components: {
    BreadCrumbList,
    ArticleConent,
    NextArticle,
    PreviousArticle,
  },
})
export default class extends Vue {
  async asyncData({ $content, params }: { $content: any; params: any }) {
    const query = $content('tech', params.slug)
    const article = await query.fetch()

    const [previous, next] = await $content('tech')
      .only(['title', 'slug'])
      .sortBy('createdAt', 'asc')
      .surround(params.slug)
      .fetch()

    return { article, previous, next }
  }
}
</script>
