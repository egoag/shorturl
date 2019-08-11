var express = require('express')
var router = express.Router()

const Url = require('../models/url')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Short URL' })
})

/* Redirect to full URL */
router.get('/:id', async (req, res, next) => {
  const url = await Url.getById({ id: req.params.id })
  if (!url || !url.url) {
    return res.status(404).send('URL not found.')
  }
  return res.redirect(301, url.url)
})

module.exports = router
