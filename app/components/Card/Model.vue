<script setup lang="ts">
import type { Model } from '~~/shared/types'

interface ExtendedModel extends Model {
  isFavorite: boolean
}

const props = withDefaults(defineProps<ExtendedModel>(), {
  isFeatured: false,
  isFavorite: false,
})

const isFavorite = ref(props.isFavorite)
const activeModel = useState<string | null>()
</script>

<template>
  <div class="relative isolate grid aspect-[170/227] grid-cols-1 grid-rows-1">
    <NuxtLink :to="url" class="col-span-full col-start-1 row-span-full row-start-1 size-full overflow-clip rounded-md bg-light-500 dark:bg-dark-500" @click="activeModel = name">
      <NuxtImg
        :src="photo.image"
        :alt="photo.description"
        :width="480"
        :height="Math.round(480 / (3 / 4))"
        fit="cover"
        loading="lazy"
        :placeholder="[120, Math.round(120 / (3 / 4)), 'lightest', 25]"
        class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500"
        :class="{ active: activeModel === name }" />
      />
    </NuxtLink>
    <div class="absolute bottom-2 left-2 z-10 flex items-center justify-center gap-1 rounded-full bg-light-500 fill-black p-1 pr-2 text-black">
      <NuxtIcon name="local:star" class="text-[16px]" />
      <span class="-ml-1 text-xs font-semi-bold">{{ rating }}</span>
      <span class="text-xs">|</span>
      <span class="text-xs">{{ reviewCount }}</span>
    </div>
    <button
      class="absolute bottom-2 right-2 aspect-square w-fit rounded-full bg-light-500 p-1 transition-colors ease-in-out"
      :class="isFavorite ? 'fill-primary-400' : 'fill-black'"
      @click="isFavorite = !isFavorite">
      <NuxtIcon name="local:love" class="text-[24px]" />
    </button>
  </div>
</template>

<style lang="css" scoped>
:root {
  @apply fill-primary-400;
}

img.active {
  view-transition-name: selected-model;
}
</style>
