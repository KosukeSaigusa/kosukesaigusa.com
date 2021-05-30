<template>
  <div>
    <div class="article-item py-4">
      <p class="created-at text-sm text-gray-600">
        {{ formatDate(article.createdAt) }} ({{
          japaneseDayOfWeek(article.createdAt)
        }})
      </p>
      <p class="title font-bold">{{ article.title }}</p>
      <div
        v-if="
          article.tags === null || article.tags === undefined
            ? false
            : article.tags.length
        "
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

  get formatDate() {
    return formatDate
  }

  get japaneseDayOfWeek() {
    return japaneseDayOfWeek
  }
}
</script>
