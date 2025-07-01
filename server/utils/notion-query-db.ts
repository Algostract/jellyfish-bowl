import type { Client } from '@notionhq/client'

import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'

export default async function <T>(notion: Client, dbId: string, filter?: QueryDatabaseParameters['filter']) {
  const content: T[] = []
  let cursor = undefined

  do {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: filter,
      page_size: 100,
      start_cursor: cursor,
    })

    content.push(...(response.results as unknown as T[]))
    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return content
}
