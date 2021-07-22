<template>
  <div>
    <ArticleContent :article="article" />
    <div class="flex gap-x-4 md:gap-x-8">
      <div class="flex-1">
        <NextPreviousArticle
          v-if="next !== null"
          :next-or-previous="'next'"
          :title="next.title"
          :path="next.path"
        />
      </div>
      <div class="flex-1">
        <div v-if="previous !== null">
          <NextPreviousArticle
            :next-or-previous="'previous'"
            :title="previous.title"
            :path="previous.path"
          />
        </div>
      </div>
    </div>
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

    const [previous, next] = await $content('note')
      .only(['title', 'slug', 'path'])
      .sortBy('createdAt', 'asc')
      .surround(params.slug)
      .fetch()

    return { article, previous, next }
  }
}
</script>
