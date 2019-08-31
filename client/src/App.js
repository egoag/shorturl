import React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthHeaders } from './lib/auth'
import Home from './components/Home'
import Jump from './components/Jump'
import Login from './components/Login'
import OAuth from './components/OAuth'
import './App.css'

const GraphqlUri = 'https://api.shorturl.henshin.me/graphql'
const client = new ApolloClient({
  uri: GraphqlUri,
  request: async operation => {
    const authHeaders = AuthHeaders()
    operation.setContext({
      headers: {
        ...authHeaders
      }
    })
  }
})

const App = () => (
  <div className="App">
    <ApolloProvider client={client}>
      <header className="App-header">
        <Router>
          <Switch>
            <Route path="/" exact component={Home} ></Route>
            <Route path="/login" component={Login} ></Route>
            <Route path="/oauth" component={OAuth} ></Route>
            <Route path="/:id([a-zA-Z0-9-_]+)" component={Jump} ></Route>
          </Switch>
        </Router>
      </header>
    </ApolloProvider>
  </div>

)

export default App
