<script setup lang="ts">
import type { Model } from '~~/shared/types'

defineProps<Pick<Model, 'id' | 'photo' | 'name' | 'url'>>()
</script>

<template>
  <NuxtLink :to="url" class="block size-16 rounded-full rounded-bl-none bg-light-400 p-1.5">
    <NuxtImg
      :src="photo.image"
      :alt="name"
      width="64"
      height="64"
      loading="eager"
      :modifiers="{ crop: 'face/200px200p/-/crop/1:1/50p,30p/' }"
      fit="cover"
      class="size-full rounded-full object-cover object-top" />
  </NuxtLink>
</template>
