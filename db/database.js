const {MongoMemoryServer}=require("mongodb-memory-server");
const { MongoClient } = require('mongodb');

let dbServer;
let connection;

const startServer=async()=>{
    dbServer=await MongoMemoryServer.create();
    return dbServer.getUri();
}

const stopServer=()=>dbServer?.stop();

async function initDb() {
    connection = (await new MongoClient(await startServer()).connect());
}
async function stopDb() {
    await connection.close();
    await stopServer();
}

const getCollection = (dbName) => connection.db("gitdb").collection(dbName);

module.exports = {
    initDb,
    stopDb,
    
    userscol: () => getCollection("userscol"),
    
    commentscol: () => getCollection("commentscol"),
    
    likescol: () => getCollection("likescol"),
    
    counterscol: () => getCollection("counterscol")

};