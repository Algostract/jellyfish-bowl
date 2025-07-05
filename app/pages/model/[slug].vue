<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug!.toString()
const { data: model } = await useFetch(`/api/model/${slug}`)

if (!model.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// grab live viewport dimensions
// const { width, height } = useWindowSize()
const { width } = useWindowSize()

const imageModifiers = computed(() => {
  return width.value >= 768
    ? { fit: 'contain' } // for md and up
    : { fit: 'cover' } // for small screens
})
</script>

<template>
  <!-- :modifiers="{
      setfill: '000000',
      crop: 'face/300px300p/-/crop/1:1/50p,25p',
      // zoom: '0.8',
    }" -->
  <main v-if="model" class="relative h-screen w-screen">
    <NuxtImg :src="model.photo.image" height="100vh" :modifiers="imageModifiers" class="absolute inset-0 h-full w-full object-cover md:object-contain" alt="Model hero shot" />
    <!-- <CompositionOverlay /> -->
  </main>
</template>

<style scoped>
img {
  view-transition-name: selected-model;
}
</style>
