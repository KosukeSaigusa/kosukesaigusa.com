<template>
  <div>
    <div class="article-item py-4">
      <p class="created-at text-sm text-gray-600">
        {{ formatDate(article.createdAt) }} ({{
          japaneseDayOfWeek(article.createdAt)
        }})
      </p>
      <p class="title font-bold">
        <nuxt-link
          :to="articlePath(article.dir, article.slug)"
          class="hover:underline hover:text-blue-700"
          >{{ article.title }}</nuxt-link
        >
      </p>
      <div
        v-if="
          article.tags === null || article.tags === undefined
            ? false
            : article.tags.length
        "
        class="flex flex-row"
      >
        <TagPills :tags="article.tags" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { formatDate, japaneseDayOfWeek } from '~/utils/datetime'
import TagPills from '~/components/TagPills.vue'

@Component({
  components: {
    TagPills,
  },
})
export default class extends Vue {
  // TODO: 後で article の型にする
  @Prop({
    type: Object,
    required: true,
  })
  article!: object

  // get showTags(): boolean {
  //   if (this.article.tags === null) {
  //     return false
  //   } else if (this.article.tags === undefined) {
  //     return false
  //   }
  //   return this.article.tags.length > 0
  // }

  // TODO: 後で dir の型を作って列挙型のようにする
  articlePath(dir: string, slug: string): string {
    return dir + '/' + slug
  }

  get formatDate() {
    return formatDate
  }

  get japaneseDayOfWeek() {
    return japaneseDayOfWeek
  }
}
</script>
