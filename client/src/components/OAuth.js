import React from 'react'
import Query from 'query-string'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const OAuth = ({ location }) => {
  const { access_token: accessToken } = Query.parse(location.hash)
  const { loading, error, data: { getAuth: data } } = useQuery(gql`
    {
      getAuth(token: "${accessToken}") {
        token
      }
    }
  `)
  if (loading) return <p>Logging in...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!data) return <p>Internal error</p>

  const { token } = data
  return (
    <p>{token}</p>
  )
}

export default OAuth
