<template>
  <div>
    <div class="post-category-tabs pb-2">
      <ul class="content-categories flex">
        <li class="content-category-item pr-4">
          <nuxt-link to="/" class="text-gray-600 hover:text-blue-700 font-bold"
            >All</nuxt-link
          >
        </li>
        <li class="content-category-item pr-4">
          <nuxt-link
            to="/tech/"
            class="text-gray-600 hover:text-blue-700 font-bold"
            >Tech</nuxt-link
          >
        </li>
        <li class="content-category-item pr-4">
          <nuxt-link
            to="/note/"
            class="text-gray-600 hover:text-blue-700 font-bold"
            >Note</nuxt-link
          >
        </li>
      </ul>
    </div>
    <p class="post-category-description text-gray-600">{{ description }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  get description(): string {
    const path = this.$route.path
    if (path === '/') {
      return 'すべての投稿'
    } else if (path === '/tech/') {
      return '技術ブログ'
    } else if (path === '/note/') {
      return '雑記ブログ'
    }
    return ''
  }
}
</script>
