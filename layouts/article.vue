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
      <div class="p-4">
        <Nuxt />
      </div>
    </div>
    <div><SiteFooter class="px-8" /></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SiteNavigation from '~/components/SiteNavigation.vue'
import SiteFotter from '~/components/SiteFooter.vue'

@Component({
  scrollToTop: true,
  components: {
    SiteNavigation,
    SiteFotter,
  },
})
export default class extends Vue {}
</script>

<style lang="postcss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
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
  line-height: 1.9;
}

.nuxt-content h3 {
  @apply font-bold text-xl pt-6 pb-2;
}

.nuxt-content p {
  @apply pb-6;
}

.nuxt-content a {
  @apply text-blue-600 hover:underline;
}

.nuxt-content ul,
ol {
  @apply pl-6 pb-4;
}

.nuxt-content li {
  @apply list-disc py-1;
}

.nuxt-content p code {
  @apply p-1 rounded-md;
  background-color: rgba(33, 90, 160, 0.07);
}

.nuxt-content li code {
  @apply p-1 rounded-md;
  background-color: rgba(33, 90, 160, 0.07);
}

.nuxt-content div {
  @apply mb-6;
}

.nuxt-content pre {
  @apply m-0 rounded-lg;
  background-color: rgba(33, 90, 160, 0.07);
}

.nuxt-content pre code {
  /* @apply text-white; */
}
</style>
