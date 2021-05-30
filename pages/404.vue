<template>
  <div>
    <p>お探しのページが見つかりません。</p>
    <p>
      <nuxt-link to="/" class="text-blue-600 hover:underline"
        >ホームへ戻る</nuxt-link
      >
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  scrollToTop: true,
  layout: '404',
  components: {},
})
export default class extends Vue {}
</script>
