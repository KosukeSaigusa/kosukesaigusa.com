<template>
  <div>
    <div class="bg-white shadow-lg rounded-lg p-4">
      <p class="font-bold">次の投稿</p>
      <p class="hover:underline hover:text-blue-700">
        <nuxt-link :to="next.path">{{ next.title }}</nuxt-link>
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
  next!: object
}
</script>
