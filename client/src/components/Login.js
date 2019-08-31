import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import Error from './Error'

const Login = () => {
  const { loading, error, data } = useQuery(gql`
    {
      getOauthUrl
    }
  `)
  if (loading) return <p>Loading...</p>
  if (error) return <Error error={error.message} />

  return (
    <a href={data.getOauthUrl}>Google</a>
  )
}

export default Login
