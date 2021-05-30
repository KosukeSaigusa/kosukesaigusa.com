<template>
  <div>
    <span>
      <nuxt-link class="text-blue-600 hover:underline" to="/">ホーム</nuxt-link>
      /
    </span>
    <span>
      <nuxt-link class="text-blue-600 hover:underline" :to="dir">{{
        postCategoryName
      }}</nuxt-link>
      /
    </span>
    <span>{{ title }} </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  name: 'BreadCrumbList',
  components: {},
})
export default class extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  title!: string

  @Prop({
    type: String,
    required: true,
  })
  dir!: string

  get postCategoryName(): string {
    if (this.dir === '/tech') {
      return '技術ブログ'
    } else if (this.dir === '/note') {
      return '雑記ブログ'
    }
    return ''
  }
}
</script>
