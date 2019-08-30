import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const Jump = ({ match: { params: { id } } }) => {
  const { loading, error, data } = useQuery(gql`
    query getUrlbyId($id: ID!){
      getUrlbyId(id: $id) {
        url
        owner {
          name
          avatar
        }
      }
    }
  `, { variables: { id } })
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>
  if (!data || !data.getUrlbyId || !data.getUrlbyId.url) return <p>Not found <span role="img" aria-label="confused">🤔</span></p>

  const { getUrlbyId: { url, owner } } = data
  window.location = url

  return (
    <div>
      {owner ? <img src={owner.avatar} alt={owner.name} height="32" width="32" /> : <div />}
      <div>
        <p>Redirecting to <a href={url}>link</a>...</p>
      </div>
    </div>
  )
}

export default Jump
