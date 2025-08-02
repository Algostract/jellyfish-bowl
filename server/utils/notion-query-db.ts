import type { Client } from '@notionhq/client'
import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'

export default async function <T>(notion: Client, dbId: string, queryOptions?: Omit<QueryDatabaseParameters, 'database_id'>): Promise<T[]> {
  const content: T[] = []
  let cursor: string | undefined = undefined

  do {
    // Merge your custom queryOptions with database_id, pagination and page_size
    const response = await notion.databases.query({
      database_id: dbId,
      page_size: 100,
      start_cursor: cursor,
      ...queryOptions,
    })

    // Cast the results to T[]
    content.push(...(response.results as unknown as T[]))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return content
}
