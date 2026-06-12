import { Redis } from '@upstash/redis'
import process from 'node:process'

process.loadEnvFile()
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
const QUEUE_NAME:string = process.env.QUEUE_NAME || ""

let polling_rate=1

async function sleep(){
    await new Promise((resolve) => setTimeout(resolve, polling_rate*1000))
    polling_rate = Math.min(polling_rate*2,30);
}


async function consume(redis:Redis){
    while (true){
        const res = await redis.rpop(QUEUE_NAME)
        if(!res)
            await sleep()
        else{
            console.log("RES = " , res);
            polling_rate=1;
        }
    }
}

async function init(){

    const redis = new Redis({
        url: url,
        token: token,
    })
    
    await consume(redis)
}
await init()