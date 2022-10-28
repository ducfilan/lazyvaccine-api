import { jest, describe, test, expect, beforeAll, afterAll, afterEach } from '@jest/globals'
import { MongoClient } from 'mongodb'

import supertest from 'supertest'
import app from '../../../src/app'
import { injectTables } from '../../../src/common/configs/mongodb-client.config'
import { DefaultLangCode } from '../../../src/common/consts'
import { resetDb } from '../../config/helpers'
import { addItemsStatistics } from '../../repo/itemsStatistics'
import { addUser, mockUserFinishedSetup } from '../../repo/users'

let mongodbClient: MongoClient
let request: supertest.SuperTest<supertest.Test>

jest.mock('../../../src/middlewares/global/auth.mw', () => jest.fn(async (req, res, next) => {
  req.user = mockUserFinishedSetup

  next()
}))

describe('Categories API test', () => {
  beforeAll(async () => {
    jest.resetModules()
    mongodbClient = await injectTables()

    request = supertest(app)
  })

  afterEach(async () => {
    await resetDb(mongodbClient)
  })

  afterAll(async () => {
    console.log("After all tests have executed")
    await mongodbClient.close(true)
  })

  test('apiGetCategories_when_noLang_should_return_Error', async () => {
    const res = await request
      .get('/api/v1/categories?lang=')

    expect(res.statusCode).toEqual(422)
    expect(res.body.error).toEqual("lang - Invalid value")
  })

  test('apiGetCategories_when_isTopCategoryNotBoolean_should_return_Error', async () => {
    const res = await request
      .get('/api/v1/categories?lang=en&isTopCategory=xx')

    expect(res.statusCode).toEqual(422)
    expect(res.body.error).toEqual("isTopCategory - should be boolean")
  })

  test('apiGetCategories_when_notSupportedLang_should_fallbackToDefaultLang', async () => {
    const res = await request
      .get('/api/v1/categories?lang=xx')

    expect(res.statusCode).toEqual(200)
    expect(res.body.map(c => c.name[DefaultLangCode])).toBeDefined()
  })

  test('apiGetCategories_when_isTopCategoryNotSpecified_should_returnAllCategories', async () => {
    const res = await request
      .get('/api/v1/categories?lang=en')

    expect(res.statusCode).toEqual(200)
    expect(res.body.map(c => !c.isTopCategory).length).toBeGreaterThan(0)
  })

  test('apiGetCategories_when_isTopCategory_should_returnOnlyTopCategories', async () => {
    const res = await request
      .get('/api/v1/categories?lang=en&isTopCategory=true')

    expect(res.statusCode).toEqual(200)
    expect(res.body.map(c => c.isTopCategory)).toHaveLength(res.body.length)
  })
})
