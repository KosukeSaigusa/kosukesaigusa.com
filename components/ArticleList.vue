<template>
  <div>
    <ul class="articles divide-y">
      <li v-for="(article, index) in articles" :key="index">
        <Article :article="article" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Article from '~/components/Article.vue'

@Component({
  components: {
    Article,
  },
})
export default class extends Vue {
  // TODO: 後で型を作る
  @Prop({
    type: Array,
    required: true,
  })
  articles!: any[]
}
</script>
