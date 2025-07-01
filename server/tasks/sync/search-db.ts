export interface TypesenseModel extends Omit<Model, 'id' | 'url' | 'isFavorite' | 'photo'> {
  slug: string
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

    const data = await notion.databases.query({
      database_id: notionDbId.model,
    })
    const models = data.results as unknown as NotionModel[]

    const documents = models
      .map(({ cover, properties }): TypesenseModel | null => {
        const title = notionTextStringify(properties.Name.title)
        return {
          slug: properties.Slug.formula.string,
          name: title,
          'photo.title': title,
          'photo.image': cover?.type === 'external' ? cover.external.url.split('/')[3] : undefined,
          'photo.description': '',
          'photo.aspectRatio': 16 / 9,
          rating: 0,
          reviewCount: 0,
          coordinate: [88.4306945 + Math.random() / 10, 22.409649 + Math.random() / 10],
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
          { name: 'slug', type: 'string' },
          { name: 'name', type: 'string', sort: true },
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
