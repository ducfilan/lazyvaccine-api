import { jest, describe, test, expect, beforeAll, afterAll, afterEach } from '@jest/globals'
import { Server } from 'http'
import { MongoClient, ObjectId } from 'mongodb'

import supertest from 'supertest'
import app from '../../../src/app'
import { injectTables } from '../../../src/common/configs/mongodb-client.config'
import { ItemsInteractionForcedDone, ItemsInteractionIgnore, ItemsInteractionStar } from '../../../src/common/consts'
import { resetDb } from '../../config/helpers'
import { addItemsInteractions } from '../../repo/itemsInteractions'
import { addUser, mockUserFinishedSetup } from '../../repo/users'

jest.mock('../../../src/middlewares/global/auth.mw', () => jest.fn(async (req, res, next) => {
  req.user = mockUserFinishedSetup

  next()
}))

let mongodbClient: MongoClient
let server: Server
let request: supertest.SuperTest<supertest.Test>

describe('Items Interactions API test', () => {
  beforeAll(async () => {
    jest.resetModules()
    mongodbClient = await injectTables()

    server = app.listen(process.env.NODE_PORT, () => {
      console.log(`listening on port ${process.env.NODE_PORT}`)
    })

    request = supertest(server)
  })

  afterEach(async () => {
    await resetDb(mongodbClient)
  })

  afterAll(async () => {
    await mongodbClient.close()
    server.close()
  })

  test('apiCountInteractedItems_when_withIgnore_should_return_notIgnoredInteractionCount', async () => {
    addUser(mongodbClient, mockUserFinishedSetup)

    const itemsInteractions = [1, 2, 3].map(i => ({
      itemId: new ObjectId(),
      setId: new ObjectId(),
      userId: mockUserFinishedSetup._id,
      interactionCount: {
        [ItemsInteractionStar]: 1,
        [ItemsInteractionForcedDone]: i == 3 ? 1 : 0,
      },
      lastUpdated: new Date(),
      interactionsDetail: []
    }))
    itemsInteractions.forEach(item => {
      addItemsInteractions(mongodbClient, item)
    })

    const res = await request
      .get('/api/v1/items-interactions/count?interactionInclude=star&interactionIgnore=forced-done')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(2)
  })

  test('apiCountInteractedItems_when_withIgnoreMultipleTypes_should_return_notIgnoredInteractionCount', async () => {
    addUser(mongodbClient, mockUserFinishedSetup)

    const itemsInteractions = [1, 2, 3].map(i => ({
      itemId: new ObjectId(),
      setId: new ObjectId(),
      userId: mockUserFinishedSetup._id,
      interactionCount: {
        [ItemsInteractionStar]: 1,
        [ItemsInteractionForcedDone]: i == 3 ? 1 : 0,
        [ItemsInteractionIgnore]: i == 2 ? 1 : 0,
      },
      lastUpdated: new Date(),
      interactionsDetail: []
    }))
    itemsInteractions.forEach(item => {
      addItemsInteractions(mongodbClient, item)
    })

    const res = await request
      .get(`/api/v1/items-interactions/count?interactionInclude=star&interactionIgnore=${ItemsInteractionForcedDone},${ItemsInteractionIgnore}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(1)
  })

  test('apiCountInteractedItems_when_noIgnore_should_return_allInteractionCount', async () => {
    addUser(mongodbClient, mockUserFinishedSetup)

    const itemsInteractions = [1, 2, 3].map(_ => ({
      itemId: new ObjectId(),
      setId: new ObjectId(),
      userId: mockUserFinishedSetup._id,
      interactionCount: {
        [ItemsInteractionStar]: 1,
      },
      lastUpdated: new Date(),
      interactionsDetail: []
    }))
    itemsInteractions.forEach(item => {
      addItemsInteractions(mongodbClient, item)
    })

    const res = await request
      .get('/api/v1/items-interactions/count?interactionInclude=star&interactionIgnore=forced-done')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(3)
  })

  test('apiCountInteractedItems_when_noStar_should_return_-1', async () => {
    const res = await request
      .get('/api/v1/items-interactions/count?interactionInclude=star&interactionIgnore=forced-done')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(-1)
  })
})
