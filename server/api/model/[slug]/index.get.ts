import { z } from 'zod'

export default defineEventHandler<Promise<Model>>(
  async (event) => {
    try {
      const { slug } = await getValidatedRouterParams(
        event,
        z.object({
          slug: z.string().min(1),
        }).parse
      )
      const config = useRuntimeConfig()
      const notionDbId = config.private.notionDbId as unknown as NotionDB

      const models = await notionQueryDb<NotionModel>(notion, notionDbId.model, {
        filter: {
          and: [
            {
              property: 'Slug',
              formula: {
                string: { contains: slug },
              },
            },
          ],
        },
      })

      console.log({ slug, models: models.length })
      const model = models[0]
      if (!models || !models.length || !model) {
        throw createError({ statusCode: 404, statusMessage: `model ${slug} not found` })
      }

      // const [aW, aH] = model.properties //.properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))

      /*       return {
              id: slug,
              title: notionTextStringify(model.properties.Name.title),
              description: notionTextStringify(model.properties.Description.rich_text),
              image: model.cover?.type === 'external' ? model.cover.external.url.split('/')[3] : undefined,
              aspectRatio: aW / aH,
              category: model.properties.Segment.select.name,
              featured: model.properties.Featured.number,
              gallery: model.properties.Gallery.checkbox,
              url: `/photo/${slug}`,
            } as PhotoDetails */

      const title = notionTextStringify(model.properties.Name.title)
      return {
        id: slug,
        name: title,
        photo: {
          image: model.cover?.type === 'external' ? model.cover.external.url.split('/')[3] : undefined,
        },
        rating: 0,
        reviewCount: 0,
        coordinate: [model.properties.Longitude.number, model.properties.Latitude.number],
        isFeatured: false,
        url: `/model/${slug}`,
      } as Model
    } catch (error: unknown) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      console.error('API  model/[slug]/index GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  }
  // { maxAge: 60 * 60 }
)
