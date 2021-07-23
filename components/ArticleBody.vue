<template>
  <div>
    <ArticleContent :article="article" />
    <div class="space-y-4 sm:space-y-0 sm:flex sm:space-x-8">
      <div class="sm:flex-1">
        <NextPreviousArticle
          v-if="next !== null && next !== undefined"
          :next-or-previous="'next'"
          :title="next.title"
          :path="next.path"
        />
      </div>
      <div class="sm:flex-1">
        <div v-if="previous !== null && previous !== undefined">
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import ArticleConent from '~/components/ArticleContent.vue'
import NextPreviousArticle from '~/components/NextPreviousArticle.vue'

@Component({
  scrollToTop: true,
  layout: 'article',
  components: {
    ArticleConent,
    NextPreviousArticle,
  },
})
export default class extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  article!: object

  @Prop({
    type: Object,
    required: false,
  })
  next: object | undefined

  @Prop({
    type: Object,
    required: false,
  })
  previous: object | undefined
}
</script>
