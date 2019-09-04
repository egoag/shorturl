import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import Url from './Url'
import Error from './Error'

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
  const { loading, error, data, fetchMore } = useQuery(MY_URLS)
  if (loading) return <p>Loading...</p>
  if (error) return <Error error={error.message} />
  if (!data || !data.getMyUrls || !data.getMyUrls.items) return <Error />

  const { lastKey, items } = data.getMyUrls
  return (
    <div>
      <ul style={{ textAlign: 'left' }}>
        {items.map(url => <Url key={url.id} url={url} />)}
      </ul>
      {lastKey
        ? <button
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
        : null
      }
    </div>

  )
}

export default Urls
