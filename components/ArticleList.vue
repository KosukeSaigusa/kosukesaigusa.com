<template>
  <div>
    <ul class="articles divide-y">
      <li v-for="(article, index) in articles" :key="index">
        <nuxt-link :to="articlePath(article.dir, article.slug)"
          ><Article :article="article"
        /></nuxt-link>
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

  // TODO: 後で dir の型を作って列挙型のようにする
  articlePath(dir: string, slug: string): string {
    return dir + '/' + slug
  }
}
</script>
