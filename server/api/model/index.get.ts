import type { TypesenseModel } from '~~/server/tasks/sync/search-db'

export default defineEventHandler<Promise<Model[]>>(
  async (event) => {
    try {
      const searchParams = getQuery<SearchParams>(event)

      const response = await typesense.collections<TypesenseModel>('model').documents().search({
        q: searchParams.query,
        query_by: searchParams.queryBy,
        filter_by: searchParams.filterBy, // e.g. "isFeatured:=true"
        sort_by: searchParams.sortBy,
        per_page: searchParams.perPage,
      })

      return (
        response.hits?.map<Model>(({ document }) => ({
          id: document.id,
          name: document.name,
          photo: {
            title: document['photo.title'],
            image: document['photo.image'],
            description: document['photo.description'],
            aspectRatio: document['photo.aspectRatio'],
          },
          rating: document.rating,
          reviewCount: document.reviewCount,
          coordinate: document.coordinate,
          isFeatured: document.isFeatured,
          url: `/model/${document.id}`,
        })) ?? []
      )
    } catch (error) {
      console.error('API model/index GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  }
  // { maxAge: 60 }
)
