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
      <div class="p-4">
        <Nuxt />
      </div>
    </div>
    <SiteFooter />
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
.nuxt-content h3 {
  @apply font-bold text-xl pt-6 pb-2;
}

.nuxt-content h4 {
  @apply font-semibold text-lg pt-6 pb-2;
}

.nuxt-content p {
  @apply pb-6;
}

.nuxt-content p em {
  @apply font-semibold;
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

.nuxt-content blockquote {
  @apply pb-6;
}

.nuxt-content blockquote p {
  @apply pl-4 py-0 italic border-l-4;
}
</style>
