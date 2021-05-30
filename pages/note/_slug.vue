<template>
  <div>あいうえお</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { formatDate, japaneseDayOfWeek } from '~/utils/datetime'

@Component({
  scrollToTop: true,
  layout: 'article',
  components: {},
})
export default class extends Vue {
  async asyncData({ $content, params }: { $content: any; params: any }) {
    const query = $content('note', params.slug)
    const article = await query.fetch()
    return { article }
  }

  get formatDate() {
    return formatDate
  }

  get japaneseDayOfWeek() {
    return japaneseDayOfWeek
  }
}
</script>
