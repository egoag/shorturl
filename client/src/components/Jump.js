import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const Jump = ({ match: { params: { id } } }) => {
  const { loading, error, data: { getUrlbyId: data } } = useQuery(gql`
    {
      getUrlbyId(id: "${id}") {
        url
        owner {
          name
          avatar
        }
      }
    }
  `)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data) return <p>Not found</p>

  const { url, owner } = data
  window.location = url

  return (
    <div>
      {owner ? <img src={owner.avatar} alt={owner.name} height="32" width="32" /> : <div />}
      <p>Redirecting...</p>
      <div>
        <p><a href={url}>Click</a> if not jump</p>
      </div>
    </div>
  )
}

export default Jump
