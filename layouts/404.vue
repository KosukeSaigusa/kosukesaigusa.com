<template>
  <div class="flex flex-col min-h-screen">
    <div
      class="
        container
        mx-auto
        flex-grow
        px-4
        sm:px-8
        mb-12
        md:px-12
        lg:max-w-screen-md
      "
    >
      <SiteNavigation />
      <SiteHeader />
      <div class="content-container p-4">
        <Nuxt />
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SiteNavigation from '~/components/SiteNavigation.vue'
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFotter from '~/components/SiteFooter.vue'

@Component({
  scrollToTop: true,
  layout: 'default',
  components: {
    SiteNavigation,
    SiteHeader,
    SiteFotter,
  },
})
export default class extends Vue {}
</script>
