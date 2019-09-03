import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import client from './graphql/client'
import Home from './components/Home'
import Jump from './components/Jump'
import OAuth from './components/OAuth'
import Login from './components/Login'
import Logout from './components/Logout'

const App = () => (
  <div className="App">
    <ApolloProvider client={client}>
      <header className="App-header">
        <Router>
          <Switch>
            <Route path="/" exact component={Home} ></Route>
            <Route path="/oauth" component={OAuth} ></Route>
            <Route path="/login" component={Login} ></Route>
            <Route path="/logout" component={Logout} ></Route>
            <Route path="/:id([a-zA-Z0-9-_]+)" component={Jump} ></Route>
          </Switch>
        </Router>
      </header>
    </ApolloProvider>
  </div>

)

export default App
