import React from 'react'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import UrlList from './UrlList'
import Error from './Error'
import { IsValidUrl } from '../lib/url'
import { IsLoggedIn } from '../lib/auth'

const ADD_URL = gql`
  mutation AddUrl($url: String!){
    addUrl(url: $url) {
      id
      url
      varies
    }
  }
`

const Home = () => {
  let input, state
  const isLoggedIn = IsLoggedIn()
  const [addUrl, { loading, error, data }] = useMutation(ADD_URL)
  if (loading) state = <p>Loading</p>
  if (error) state = <Error error={error.message}/>
  if (data && data.addUrl) {
    const { id, url } = data.addUrl
    state = (
      <div>
        <p>
          New Link: <code>https://shorturl.henshin.me/{id}</code> <a href={`/${id}`} target="_blank" rel="noopener noreferrer" >Open</a>
        </p>
        <p>Orignal Link: {url}</p>
      </div>
    )
  }

  return (
    <div>
      <header>
        <h2>Welcome</h2>
        {
          isLoggedIn
            ? <p><Link to="/logout">Logout</Link></p>
            : <p><Link to="/login">Login</Link></p>
        }
      </header>

      <form onSubmit={e => {
        const url = input.value
        e.preventDefault()
        if (!IsValidUrl(url)) {
          alert('Invalid URL!😵')
        } else {
          addUrl({ variables: { url: input.value } })
          input.value = ''
        }
      }}>
        <input ref={node => { input = node }} placeholder="Orignal Link"></input>
        <button type="submit">Go</button>
      </form>
      {state}
      {isLoggedIn ? <UrlList /> : null}
    </div>
  )
}

export default Home
