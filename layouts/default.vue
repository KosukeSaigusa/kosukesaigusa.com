<template>
  <div class="flex flex-col min-h-screen">
    <div><SiteNavigation class="px-8 mb-4" /></div>
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
      <SiteHeader />
      <div class="content-container rounded-lg p-4 bg-gray-100">
        <Nuxt />
      </div>
    </div>
    <div><SiteFooter class="px-8" /></div>
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

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.9;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

* {
  color: #222222;
}

.content-category-item a {
  color: #2c3e50;
}

.content-category-item a.nuxt-link-exact-active {
  color: #1e4ed8;
}
</style>
