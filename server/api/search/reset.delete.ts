export async function resetSearchDb() {
  try {
    await typesense.collections('model').retrieve()
    // console.log('Collection "model" exists. Deleting...')
    await typesense.collections('model').delete()
  } catch {
    // console.log('Collection "model" does not exist. Skipping deletion.')
  }

  // Create collection
  // console.log('Creating collection "model"...')
  await typesense.collections().create({
    name: 'model',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'name', type: 'string', sort: true },
      { name: 'fee', type: 'int32', sort: true },
      { name: 'status', type: 'string', sort: true, facet: true },
      { name: 'photo.title', type: 'string' },
      { name: 'photo.image', type: 'string' },
      { name: 'photo.description', type: 'string' },
      { name: 'photo.aspectRatio', type: 'float' },
      { name: 'rating', type: 'float' },
      { name: 'reviewCount', type: 'int32' },
      { name: 'isFeatured', type: 'bool', optional: true },
      { name: 'coordinate', type: 'geopoint' },
    ],
    default_sorting_field: 'rating',
  })
}

export default defineEventHandler(async () => {
  await resetSearchDb()
  return { result: 'success' }
})
