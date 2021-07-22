<template>
  <div>
    <div class="bg-white shadow-lg rounded-lg p-4">
      <p class="font-bold">
        {{ nextOrPrevious === 'next' ? '次' : '前' }}の投稿
      </p>
      <p class="hover:underline hover:text-blue-700">
        <nuxt-link :to="path">{{ title }}</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  scrollToTop: true,
  layout: 'article',
  components: {},
})
export default class extends Vue {
  // TODO: next or previous の enum か interface を作る
  @Prop({
    type: String,
    required: true,
  })
  nextOrPrevious!: object

  @Prop({
    type: String,
    required: true,
  })
  title!: object

  @Prop({
    type: String,
    required: true,
  })
  path!: object
}
</script>
