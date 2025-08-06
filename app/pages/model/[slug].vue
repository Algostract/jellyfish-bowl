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

function humanizeKey(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (m) => m.toUpperCase())
    .trim()
}

const sections = computed(() => {
  if (!model.value?.details) return []

  const keys = Object.keys(model.value.details).filter((k) => k !== 'fee' && k !== 'name')

  return keys.map((key) => {
    const rawSection = model.value!.details[key as keyof typeof model.value.details]
    if (typeof rawSection !== 'object' || !rawSection) return { key, title: humanizeKey(key), items: [] }
    const items = Object.entries(rawSection as object).map(([k, v]) => {
      let display: string | number = v

      if (Array.isArray(v)) {
        display = v.join(', ')
      } else if (typeof v === 'boolean') {
        display = v ? 'Yes' : 'No'
      } else if (k.toLowerCase() === 'age' && typeof v === 'number') {
        display = `${v} Years`
      }

      const color = typeof v === 'string' && /^#([0-9A-F]{3,6})$/i.test(v) ? v : undefined

      return {
        label: humanizeKey(k),
        value: display,
        color,
      }
    })

    return {
      key,
      title: humanizeKey(key),
      items,
    }
  })
})
</script>

<template>
  <main v-if="model" class="relative h-dvh w-dvw">
    <!-- :modifiers="{
        setfill: '000000',
        crop: 'face/300px300p/-/crop/1:1/50p,25p',
        // zoom: '0.8',
      }" -->
    <NuxtImg :src="model.photo.image" height="100dvh" :modifiers="imageModifiers" class="absolute inset-0 h-full w-full object-cover md:object-contain" alt="Model hero shot" />
    <!-- <CompositionOverlay /> -->
    <!-- Details Overlay -->
    <div class="glass-effect absolute bottom-24 left-0 flex aspect-[0.85] min-h-0 w-full max-w-[94vw] flex-col space-y-4 rounded-r-xl p-6 text-white md:max-w-md">
      <h1 class="text-2xl">{{ model.name }}</h1>
      <!-- Auto-discovered Sections -->
      <div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <div v-for="section in sections" :key="section.key">
          <h2 class="mb-2 text-lg">{{ section.title }}</h2>
          <div class="text-md grid grid-cols-2 gap-y-5">
            <div v-for="item in section.items" :key="item.label" class="flex flex-col gap-0.5 capitalize">
              <span>{{ item.label }}</span>
              <span :class="item.color ? `text-[${item.color}]` : ''">
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <h2 class="text-xl">Fee</h2>
        <p class="text-lg">₹ {{ model.fee }} / day</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
img {
  view-transition-name: selected-model;
}
</style>
