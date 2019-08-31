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
  if (error) return <p>{error.message}</p>
  if (!data || !data.getMyUrls || !data.getMyUrls.items) return <Error />

  const { lastKey, items } = data.getMyUrls
  return (
    <div>
      <button
        disabled={!lastKey}
        onClick={() => {
          fetchMore({
            query: MY_URLS,
            variables: { lastKey },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              console.log(previousResult)
              console.log(fetchMoreResult)
            }
          })
        }}>{ lastKey ? 'Load more' : 'no more'}</button>
      <ul>
        {items.map(({ id, url, latest }) => (
          <li>
            <a href={`/${id}`}>
              {GetDomain(url) || id}
            </a>
            ({id})
          </li>
        ))}
      </ul>
    </div>

  )
}

export default Urls
