import { syncSearchDb } from '~~/server/api/search/sync.post'

export default defineTask({
  meta: {
    name: 'search:sync',
    description: 'Sync notion resources into search db',
  },
  async run() {
    console.log('Running Task search:sync...')

    await syncSearchDb()

    return { result: 'success' }
  },
})
