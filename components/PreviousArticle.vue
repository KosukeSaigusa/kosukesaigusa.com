<template>
  <div>
    <div class="bg-white shadow-lg rounded-lg p-4">
      <p class="font-bold">前の投稿</p>
      <p class="hover:underline hover:text-blue-700">
        <nuxt-link :to="previous.path">{{ previous.title }}</nuxt-link>
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
  // TODO: 後で previous/next の型にする
  @Prop({
    type: Object,
    required: true,
  })
  previous!: object
}
</script>
