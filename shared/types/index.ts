export interface Photo {
  id: string
  title: string
  image?: string
  description: string
  featured: null | number
  aspectRatio: number
  url: string
}

export interface Model {
  id: string
  name: string
  photo: Pick<Photo, 'title' | 'description' | 'image' | 'aspectRatio'>
  rating: number
  reviewCount: number
  isFeatured?: boolean
  coordinate: [number, number]
  url: string
}

export interface SearchParams {
  query: string
  queryBy: string
  filterBy: string
  sortBy: string
  perPage: number
}

/* Server Only */
export const resourceTypes = ['asset', 'model', 'studio'] as const

export type ResourceType = (typeof resourceTypes)[number]

export type NotionDB = { [K in ResourceType]: string }

type NotionImage =
  | {
      type: 'file'
      file: {
        url: string
        expiry_time: string
      }
    }
  | {
      type: 'external'
      external: {
        url: string
      }
    }
  | null

export interface NotionProject {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: NotionImage
  icon: NotionImage
  properties: {
    Name: {
      title: {
        type: string
        text: {
          content: string
          link: null
        }
        plain_text: string
        href: null
      }[]
    }
  }
  url: string
  public_url: null
}

export interface NotionModel {
  id: string
  created_time: string
  last_edited_time: string
  cover: NotionImage
  icon: NotionImage
  properties: {
    Slug: {
      type: 'formula'
      formula: {
        string: string
      }
    }
    Name: { type: 'title'; title: { plain_text: string }[] }
    Email: { type: 'email'; email: string }
    Phone: { type: 'phone_number'; phone_number: string }
    Instagram: { type: 'url'; url: string }
    Project: { type: 'relation'; relation: string[]; has_more: false }
  }
  url: string
  public_url: null
}

export interface NotionAsset {
  id: string
  created_time: string
  last_edited_time: string
  cover: NotionImage
  icon: NotionImage
  properties: {
    Index: { number: number }
    'Project Index': {
      rollup: {
        array: {
          number: number
        }[]
      }
    }
    Name: {
      title: {
        plain_text: string
      }[]
    }
    Slug: {
      formula: {
        string: string
      }
    }
    Description: {
      rich_text: {
        text: {
          content: string
        }
      }[]
    }
    Type: {
      select: {
        name: 'Photo' | 'Video'
      }
    }
    Status: {
      status: {
        name: 'Plan' | 'Draft' | 'Release' | 'Archive'
      }
    }
    Project: { relation: string[]; has_more: false }
    Model: { relation: string[]; has_more: false }
    Featured: { number: number }
    Resolution: {
      select: {
        name: Resolution
      }
    }
    'Aspect ratio': {
      select: {
        name: AspectRatio
      }
    }
  }
}
