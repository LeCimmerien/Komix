import Redis from 'ioredis'
import { env } from '$env/dynamic/private'

const redis = new Redis(env.REDIS_URL, { lazyConnect: true })

export default redis
