import { gql } from 'apollo-boost'
import { arrRemove } from '../lib/utils'

const GET_VISABLE_URLS = gql`
  query GetVisiableUrls {
    visiableUrls @client
  }
`

const isVersionVisiable = (_url, args, { cache }) => {
  const { visiableUrls } = cache.readQuery({ query: GET_VISABLE_URLS })
  return visiableUrls.includes(args.id)
}

const toggleVersionVisibility = (_url, { id }, { cache }) => {
  let newVisiableUrls
  const { visiableUrls } = cache.readQuery({ query: GET_VISABLE_URLS })
  const index = visiableUrls.indexOf(id)
  if (index >= 0) {
    newVisiableUrls = arrRemove(visiableUrls, id)
  } else {
    newVisiableUrls = visiableUrls.concat([id])
  }
  cache.writeData({ data: {
    visiableUrls: newVisiableUrls
  } })
  return !(index >= 0)
}

export default {
  Query: {
    isVersionVisiable
  },
  Mutation: {
    toggleVersionVisibility
  }
}
