<script setup lang="ts">
const title = `Gold Fish Bowl`
const description = `Locality‑focused, talent marketplace marketplace where models, makeup artist, designer etc can be found for commercial shoot`

const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/landing.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: siteUrl,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [{ name: 'Home', item: '/' }],
  }),
])

const { data: models } = await useFetch('/api/model', {
  query: {
    query: '',
    queryBy: 'name',
    filterBy: '',
    sortBy: 'name:asc',
    perPage: 10,
  },
})
</script>

<template>
  <main class="relative isolate mx-auto flex min-h-screen max-w-[90rem] flex-col items-center justify-center gap-4 overflow-hidden px-2 md:mb-8 md:px-4">
    <!-- Hero section -->
    <section class="overlay relative h-screen w-screen">
      <div class="absolute bottom-0 left-0 z-10 flex w-full flex-col gap-4 px-4 py-8 text-white">
        <p class="font-sub text-xl font-semi-bold uppercase [text-shadow:2px_2px_4px_rgba(0,0,0,0.25)]">
          World's Best
          <br />
          <strong class="text-3xl font-regular">models</strong>
        </p>
        <p class="text-base [text-shadow:2px_2px_4px_rgba(0,0,0,0.25)]">Connect with nearby <br />models with ease</p>
        <div class="scrollbar-hidden relative mb-8 w-full overflow-x-scroll">
          <div class="flex w-fit gap-6">
            <MarkerModel v-for="{ id, photo, name, url } in models" :id="id" :key="id" :photo="photo" :name="name" :url="url" />
          </div>
        </div>
        <NuxtLink to="/model" class="w-fit rounded-full bg-light-500 px-5 py-3 text-black"> Let's get started </NuxtLink>
      </div>
      <NuxtImg provider="ipx" src="/images/model-1.png" alt="Model" :width="720" :height="Math.round(720 / (9 / 16))" fit="cover" class="h-full w-full bg-[#D4E0EA] object-contain object-bottom" />
    </section>
  </main>
</template>

<style>
.overlay {
  @apply after:absolute after:left-0 after:top-0 after:z-0 after:h-screen after:w-screen after:bg-gradient-to-b after:from-black/0 after:from-[50%] after:to-black/40 after:to-[100%] after:content-[''];
}
</style>
