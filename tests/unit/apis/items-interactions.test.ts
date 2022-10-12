import { jest, describe, test, expect, beforeAll } from '@jest/globals'
import { ObjectId } from 'mongodb'

import request from 'supertest'
import app from '../../../src/app'
import { injectTables } from '../../../src/common/configs/mongodb-client.config'

const mockUser = {
  "_id": new ObjectId("61ced7be4d51dc003e3615a8"),
  "type": "google",
  "finishedRegisterStep": 2,
  "name": "Duc Hoang",
  "email": "ducfilan@gmail.com",
  "locale": "en",
  "pictureUrl": "https://lh3.googleusercontent.com/a-/AOh14GgQdnguHUvyPcjZsAk7Dzz7sIe5zdmZD-JD0Je19g8=s96-c",
  "langCodes": [
    "en",
    "zh",
    "vi",
    "ja"
  ],
  "pages": [
    "facebook",
    "youtube",
    "amazon",
    "twitter",
    "google",
    "reddit",
    "messenger",
    "ebay",
    "pinterest"
  ]
}

jest.mock('../../../src/middlewares/global/auth.mw', () => jest.fn(async (req, res, next) => {
  req.user = mockUser

  next()
}))

describe('Items Interactions API test', () => {
  beforeAll(async () => {
    await injectTables()
  })

  test('apiCountInteractedItems', async () => {
    const res = await request(app)
      .get('/api/v1/items-interactions/count?interactionInclude=star&interactionIgnore=forced-done')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(-1)
  })
})
