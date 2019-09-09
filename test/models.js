const assert = require('assert')
const { describe, it } = require('mocha')

const Url = require('../models/url')
const User = require('../models/user')
const randomId = require('../lib/randomId')

const URL = 'https://localhost'
const NEW_URL = 'https://example.com'
const URL_ID = randomId()
const EMAIL = `${randomId()}@gmail.com`
const AVATAR = 'https://lh6.googleusercontent.com/-J_c_gM2Z8-w/AAAAAAAAAAI/AAAAAAAAIbo/e5HygWEOqoY/photo.jpg'

describe('Models', () => {
  describe('Create new user', () => {
    it('should success', async () => {
      const user = new User({ id: EMAIL, avatar: AVATAR })
      await user.create()
    })
  })

  describe('Get user by id', () => {
    it('should success', async () => {
      await User.getById(EMAIL)
    })
  })

  describe('Get urls', () => {
    it('could fail because async!', async () => {
      await User.getUrlsByOwnerId({ ownerId: EMAIL })
    })
  })

  describe('Create url', () => {
    it('should success', async () => {
      const url = new Url({ urlId: URL_ID, url: URL, ownerId: EMAIL })
      await url.create()
    })
  })

  describe('List url', () => {
    it('should success', async () => {
      const urls = await Url.list({})
      assert(urls.items, 'No items')
      assert(urls.items.length > 0, 'No items')
    })
  })

  describe('Get url', () => {
    it('should success', async () => {
      await Url.getById({ id: URL_ID })
    })
  })

  describe('Update url\'s url', () => {
    it('should success', async () => {
      const url = await Url.getById({ id: URL_ID })
      await url.updateUrl(NEW_URL)
    })
  })

  describe('Get all version urls', () => {
    it('should success', async () => {
      const urls = await Url.getByIdAllVersion({ id: URL_ID })
      assert(urls.items, 'No items')
      assert(urls.items.length > 0, 'No items')
      assert(urls.count, 'No count')
      assert(urls.scannedCount, 'No scannedCount')
    })
  })

  // describe('Get url by ownerId', () => {
  //   it('should success', async () => {
  //     const urls = await Url.getByOwnerId({ ownerId: EMAIL })
  //     assert(urls.items, 'No items')
  //     assert(urls.items.length > 0, 'No items')
  //     assert(urls.count, 'No count')
  //     assert(urls.scannedCount, 'No scannedCount')
  //   })
  // })

  describe('Delete url', () => {
    it('should success', async () => {
      const url = await Url.getById({ id: URL_ID })
      await url.delete()
    })
  })
})
