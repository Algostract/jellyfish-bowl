export interface TypesenseModel extends Omit<Model, 'url' | 'isFavorite' | 'photo'> {
  'photo.title': string
  'photo.image'?: string
  'photo.description': string
  'photo.aspectRatio': number
}

export default defineTask({
  meta: {
    name: 'sync:search-db',
    description: 'Sync notion resources into search db',
  },
  async run() {
    console.log('Running Task sync:search-db...')

    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    const models = await notionQueryDb<NotionModel>(notion, notionDbId.model)

    const documents = models
      .map(({ cover, properties }): TypesenseModel | null => {
        const title = notionTextStringify(properties.Name.title)

        if (!(properties.Latitude.number && properties.Longitude.number)) return null

        return {
          id: properties.Slug.formula.string,
          name: title,
          status: properties.Status.status.name,
          'photo.title': title,
          'photo.image': cover?.type === 'external' ? cover.external.url.split('/')[3] : undefined,
          'photo.description': '',
          'photo.aspectRatio': 16 / 9,
          rating: 0,
          reviewCount: 0,
          coordinate: [properties.Longitude.number, properties.Latitude.number],
          isFeatured: false,
        }
      })
      .filter((item) => item !== null)

    // Check if collection exists
    let collectionExists = false
    try {
      await typesense.collections('model').retrieve()
      collectionExists = true
    } catch {
      collectionExists = false
    }

    // Create collection if it doesn't exist
    if (!collectionExists) {
      await typesense.collections().create({
        name: 'model',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'name', type: 'string', sort: true },
          { name: 'status', type: 'string', sort: true },
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

    try {
      // Upsert documents (update if exists, create if not)
      await typesense.collections('model').documents().import(documents, { action: 'upsert' })
    } catch (error) {
      console.error('Upsert error', error.importResults)
    }

    return { result: 'success' }
  },
})
