import { Redis } from '@upstash/redis'
import process from 'node:process'
import {Client} from "pg"
import type { TrackingPayload } from './types.js'

// process.loadEnvFile()
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
const QUEUE_NAME:string = process.env.QUEUE_NAME || ""

let polling_rate=2

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,       // Your database name
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

console.log("STARTING ............................")
console.log("DBCONFIG = ")
console.log(dbConfig)

async function sleep(){
    await new Promise((resolve) => setTimeout(resolve, polling_rate*1000))
    polling_rate = Math.min(polling_rate*3,30);
}

async function send_query(res:TrackingPayload){
    const client = new Client(dbConfig);
    try {
        await client.connect();
        
        const query = `
            INSERT INTO logs (modelName, input_tokens, output_tokens)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [res.modelName, res.input_tokens, res.output_tokens];
        const result = await client.query(query, values);
        
        console.log({
            success: true,
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('Database error:', error);
        console.log({
            success: false,
            error: error
        });
        
    } finally {
        console.log("Ending client ..");
        await client.end();
    }
}


async function consume(redis:Redis){
    
    while (true){
        const res:TrackingPayload = await redis.rpop(QUEUE_NAME)
        if(!res)
            await sleep()
        else{
            console.log("RES = " , res);
            await send_query(res)
            console.log("Query 'sent' ")
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