import React from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

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
  const [addUrl, { loading, error, data }] = useMutation(ADD_URL)
  if (loading) state = <p>Loading</p>
  if (error) state = <p>{error.message}</p>
  if (data && data.addUrl) {
    const { id, url } = data.addUrl
    state = (
      <div>
        <p>
          New Link: <code>https://shorturl.henshin.me/{id}</code> <a href={`/${id}`} target="blank" >Open</a>
        </p>
        <p>Orignal Link: {url}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome</h1>
      <form onSubmit={e => {
        e.preventDefault()
        addUrl({ variables: { url: input.value } })
        input.value = ''
      }}>
        <input ref={node => { input = node }} placeholder="Orignal Link"></input>
        <button type="submit">Go</button>
      </form>
      {state}
    </div>
  )
}

export default Home
