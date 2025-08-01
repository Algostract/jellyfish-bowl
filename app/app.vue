<script setup lang="ts">
const title = `Gold Fish Bowl`
const description = `Locality‑focused, talent marketplace marketplace where models, makeup artist, designer etc can be found for commercial shoot`

const {
  app: { buildTime },
  public: { siteUrl, vapidKey },
} = useRuntimeConfig()

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})

useSeoMeta({
  ogType: 'profile',
  ogImageWidth: 1280,
  ogImageHeight: 640,
  fbAppId: 966242223397117,
  twitterCard: 'summary_large_image',
  colorScheme: 'light dark',
})

useSchemaOrg([
  defineWebPage({
    datePublished: new Date(2025, 4, 15).toISOString(),
    dateModified: buildTime,
    author: 'Shirsendu Bairagi',
  }),
  defineWebSite({
    url: siteUrl,
    name: title,
    description: description,
  }),
])

const { $api } = useNuxtApp()
const { isSupported, permissionGranted } = useWebNotification()

async function getExistingSubscription() {
  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    })
  }

  await $api('/api/notification/push/subscribe', {
    method: 'POST',
    body: subscription.toJSON(),
  })

  return subscription
}

onMounted(async () => {
  if (isSupported.value && permissionGranted.value) await getExistingSubscription()
})

watch(permissionGranted, async (value) => {
  if (value) await getExistingSubscription()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaManifest />
  <NuxtPwaAssets />
  <NuxtLoadingIndicator color="#0593FA" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <LazyAppInstallPrompt hydrate-on-idle />
</template>

<style>
* {
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: 6px;
  @apply antialiased;
}

*::-webkit-scrollbar {
  @apply block size-[6px] bg-light-400 dark:bg-dark-400;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-600 dark:bg-dark-600;
}

html {
  @apply relative overflow-x-hidden scroll-smooth;
}

body {
  @apply relative min-h-screen overflow-x-hidden bg-light-400 fill-black font-main text-black dark:bg-dark-400 dark:fill-white dark:text-white;
}

svg.iconify--local {
  @apply !m-0 !box-content;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
