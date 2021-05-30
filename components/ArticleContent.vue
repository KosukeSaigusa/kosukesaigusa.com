<template>
  <article>
    <BreadCrumbList :title="article.title" :dir="article.dir" />
    <hr class="my-4" />
    <div class="article-header">
      <h2 class="font-bold text-2xl py-1">
        {{ article.title || '' }}
      </h2>
      <span
        >投稿日：{{ formatDate(article.createdAt) || '' }} ({{
          japaneseDayOfWeek(article.createdAt) || ''
        }})</span
      >
    </div>
    <hr class="mt-6" />
    <nuxt-content :document="article" />
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { formatDate, japaneseDayOfWeek } from '~/utils/datetime'

@Component({
  scrollToTop: true,
  layout: 'article',
  components: {},
})
export default class extends Vue {
  // TODO: 後で article の型にする
  @Prop({
    type: Object,
    required: true,
  })
  article!: object

  get formatDate() {
    return formatDate
  }

  get japaneseDayOfWeek() {
    return japaneseDayOfWeek
  }
}
</script>
