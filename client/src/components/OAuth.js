import React from 'react'
import Query from 'query-string'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const OAuth = ({ location }) => {
  const { access_token: accessToken } = Query.parse(location.hash)
  const { loading, error, data } = useQuery(gql`
    query getAuth($accessToken: String!){
      getAuth(token: $accessToken) {
        token
      }
    }
  `, { variables: { accessToken } })
  if (loading) return <p>Logging in...</p>
  if (error) return <p>{error.message}</p>
  if (!data || !data.getAuth || !data.getAuth.token) {
    return (
      <div>
        <p>Crashed! <span role="img" aria-label="crashed">😵</span></p>
        <p>Please try again later.</p>
      </div>
    )
  }

  const { getAuth: { token } } = data
  return (
    <p>{token}</p>
  )
}

export default OAuth
