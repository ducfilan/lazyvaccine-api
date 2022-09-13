import { RedisClientType } from '@redis/client'
import { createClient } from 'redis'

let GlobalClient: RedisClientType

export async function getClient() {
  try {
    if (GlobalClient && GlobalClient.isOpen) {
      return GlobalClient
    }

    const url = `${process.env.REDIS_SCHEME}://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
    console.info('connecting to redis server: ' + process.env.REDIS_ENDPOINT)

    GlobalClient = createClient({
      url
    })

    GlobalClient.on('error', (err) => console.error('Redis Client Error', err));

    await GlobalClient.connect()

    return GlobalClient
  }
  catch (error) {
    console.error(error)
  }
}

export async function setCache(key: string, value, options = {}, ignoreError = true) {
  try {
    const client = await getClient()
    if (!client) return

    await client.set(key, JSON.stringify(value), options)
  } catch (error) {
    if (!ignoreError) {
      throw error
    }
  }
}

export async function delCache(key: string) {
  const client = await getClient()
  if (!client) throw new Error('client is not initialized')

  await client.del(key)
}

export async function getCache(key: string, ignoreError = true, fallbackValue = null) {
  try {
    const client = await getClient()
    if (!client) return null

    const cachedValue = await client.get(key)
    if (!cachedValue) return fallbackValue

    return JSON.parse(cachedValue)
  } catch (error) {
    if (ignoreError) {
      return fallbackValue
    }

    throw error
  }
}
