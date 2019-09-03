import React from 'react'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'

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

const GET_VERSION_VISIABLE = gql`
  query IsVersionVisiable($id: ID!) {
    isVersionVisiable(id: $id) @client(always: true)
  }
`

const TOGGLE_VISIABLE = gql`
  mutation ToggleVersionVisibility ($id: ID!) {
    toggleVersionVisibility(id: $id) @client
  }
`

const GET_URL_VERSIONS = gql`
  query getUrlbyId($id: ID!) {
    getUrlbyId(id: $id) {
      versions {
        count
        lastKey
        items {
          url
          varies
          createdAt
        }
      }
    }
  }
`

const Version = ({ url: { url, varies, createdAt } }) => (
  <li className="url-version">
    <span>{varies} {createdAt} {url}</span>
  </li>
)

const UrlVersions = ({ id }) => {
  const { loading, error, data, fetchMore } = useQuery(GET_URL_VERSIONS, { variables: { id } })
  if (loading) return <p>Loading...</p>
  if (error) return <Error error={error.message} />
  if (!data || !data.getUrlbyId || !data.getUrlbyId.versions || !data.getUrlbyId.versions.items) return <Error />

  const { items } = data.getUrlbyId.versions
  return (
    <ul>
      {items.length > 1
        ? items.slice(1).map(item => <Version url={item} />) : <p>no version</p>}
    </ul>
  )
}

const Url = ({ url: { id, url, latest } }) => {
  const domain = GetDomain(url)
  const { data: { isVersionVisiable }, refetch } = useQuery(GET_VERSION_VISIABLE, { variables: { id } })
  const [toggleVersion] = useMutation(TOGGLE_VISIABLE, { variables: { id } })

  const toggle = () => {
    toggleVersion()
    refetch() // @client(always: true) does not work, had to refetch manualll...
  }
  const modify = () => {}

  return (
    <li>
      <span className="url-id">
        {
          domain
            ? <span>
              <Link to={`/${id}`} target="_blank" rel="noopener noreferrer" >
                {id}
              </Link>
              <span className="url-title">({domain})</span>
            </span>
            : <span>{id}</span>
        }
      </span>
      <span className="url-info">
        <span className="url-info-version clickable" onClick={toggle}>
          V{latest}{isVersionVisiable ? '▾' : '▴'}
        </span>
        <span className="url-info-modify clickable" onClick={modify}>
          Modify
        </span>
      </span>
      {isVersionVisiable
        ? <UrlVersions id={id}/>
        : null}
    </li>
  )
}

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
