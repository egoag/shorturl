const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const graphql = require('./graphql')
const { authMiddleware } = require('./lib/auth')

const app = express()

const CORS = {
  origin: '*',
  methods: '*',
  credentials: true
}

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// auth
app.use(authMiddleware)

// index /
app.get('/', (_, res) => {
  res.json({
    message: 'welcome',
    api: '/api',
    graphql: '/graphql'
  })
})

// enable /graphql
graphql.applyMiddleware({ app, cors: CORS })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  return res.status(err.status || 500).json({ error: err.message })
})

module.exports = app
