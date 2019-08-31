import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import Error from './Error'
import { GetDomain } from '../lib/url'

const MY_URLS = gql`
  query getMyUrls($limit: Int, $lastKey: String){
    getMyUrls(limit: $limit, lastKey: $lastKey){
      count
      lastKey
      items {
        id
        url
        latest
      }
    }
  }
`

const Urls = () => {
  // const urls = []
  const { loading, error, data, fetchMore } = useQuery(MY_URLS)
  if (loading) return <p>Loading...</p>
  if (error) return <Error error={error.message} />
  if (!data || !data.getMyUrls || !data.getMyUrls.items) return <Error />

  const { lastKey, items } = data.getMyUrls
  return (
    <div>
      <ul style={{ textAlign: 'left' }}>
        {items.map(({ id, url, latest }) => {
          const domain = GetDomain(url)
          return (
            <li key={id}>
              <a href={`/${id}`}>
                {id}
              </a>
              {domain ? `(${domain})` : ''}
            </li>
          )
        })}
      </ul>
      <button
        disabled={!lastKey}
        onClick={() => {
          fetchMore({
            query: MY_URLS,
            variables: { lastKey },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { count: previousCount, items: previousItems } = previousResult.getMyUrls
              const { count, lastKey, items } = fetchMoreResult.getMyUrls
              return {
                getMyUrls: {
                  count: count + previousCount,
                  lastKey,
                  items: [...previousItems, ...items],
                  __typename: previousResult.getMyUrls.__typename
                }
              }
            }
          })
        }}>
        More
      </button>
    </div>

  )
}

export default Urls
