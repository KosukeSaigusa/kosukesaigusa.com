<template>
  <div>
    <div class="bg-white shadow-lg hover:shadow-2xl rounded-lg p-4">
      <div v-if="nextOrPrevious === 'next'" class="flex">
        <p class="my-auto pr-2">
          <outline-arrow-circle-left-icon class="w-6 h-6" />
        </p>
        <p class="font-bold">次の投稿</p>
      </div>
      <div v-if="nextOrPrevious === 'previous'" class="flex">
        <p class="font-bold">前の投稿</p>
        <p class="my-auto pl-2">
          <outline-arrow-circle-right-icon class="w-6 h-6" />
        </p>
      </div>
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
