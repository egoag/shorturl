import React from 'react'
import Query from 'query-string'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import Error from './Error'

const OAuth = ({ location, history }) => {
  const { access_token: accessToken } = Query.parse(location.hash)
  const { loading, error, data } = useQuery(gql`
    query getAuth($accessToken: String!){
      getAuth(token: $accessToken) {
        token
        expiresAt
      }
    }
  `, { variables: { accessToken } })
  if (loading) return <p>Logging in...</p>
  if (error) return <Error error={error.message} />
  if (!data || !data.getAuth || !data.getAuth.token) return <Error />

  const { getAuth: { token, expiresAt } } = data
  localStorage.setItem('token', token)
  localStorage.setItem('tokenExpiresAt', expiresAt)

  history.push('/')
  return (
    <p>Logged in, redirecting...</p>
  )
}

export default OAuth
