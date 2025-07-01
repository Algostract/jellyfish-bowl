<script setup lang="ts">
const title = `Gold Fish Bowl`
const description = `Locality‑focused, talent marketplace app`

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
</script>

<template>
  <main class="flex h-screen w-screen items-center justify-center">
    <NuxtLink to="/model" class="rounded-full bg-light-500 px-5 py-3 text-black"> Let's get started </NuxtLink>
  </main>
</template>
