const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')

const graphql = require('./graphql')
const indexRouter = require('./routes/index')
const { authMiddleware } = require('./lib/auth')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// auth
app.use(authMiddleware)

// enable /graphql
graphql.applyMiddleware({ app })

// handle other routes
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message
  // res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  // res.status(err.status || 500)
  // res.render('error')
  return res.status(err.status || 500).json({ error: err.message })
})

module.exports = app
