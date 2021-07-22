<template>
  <div class="tags">
    <span
      v-for="(tag, index) in tags"
      :key="index"
      class="
        text-xs
        items-center
        font-bold
        leading-sm
        px-3
        py-1
        mt-1
        mr-1
        bg-blue-200
        text-blue-700
        rounded-full
      "
    >
      {{ tag }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'default',
  components: {},
})
export default class extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  tags!: string[]
}
</script>
