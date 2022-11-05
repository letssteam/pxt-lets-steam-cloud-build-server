const {S3Client, ListObjectsCommand, GetObjectCommand, GetObjectLockConfigurationCommand} = require('@aws-sdk/client-s3')
const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { dirname, resolve } = require('path')

require('dotenv').config({path : './server.env', encoding : 'utf-8'})


const MAX_PARRALEL_BUILDS = 1
var current_builds = []

const s3Client = new S3Client({
    endpoint : "https://fra1.digitaloceanspaces.com",
    forcePathStyle : false,
    region : "fra1",
    credentials : {
       accessKeyId : process.env.ACCESS_KEY,
       secretAccessKey : process.env.SECRET_KEY
    }
 })

setInterval(async () => {
    let files = await (await s3Client.send(new ListObjectsCommand({Bucket : "pxt-lets-steam-backend-test", Prefix : 'sources'})))
    files.Contents.forEach(async file => {
        if (!existsSync(file.Key)) {
            if (!existsSync(__dirname+dirname(file.Key)))
                mkdirSync(dirname(file.Key), {recursive : true})
            let fileContent = await s3Client.send(new GetObjectCommand({Bucket : "pxt-lets-steam-backend-test", Key : file.Key}))
            writeFileSync(file.Key, await fileContent.Body.transformToString('utf-8'))
        }
    })
}, 1000)
