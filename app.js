'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require("./db/database");

const startServer = async () => {
    await db.initDb();
    console.log("database initialised");
    
    // set the view engine to ejs
    app.set('view engine', 'ejs');
    
    // to parse the json requests
    app.use(express.json());
    
    // routes
    app.use('/', require('./routes/router')());
    app.use('*', (req, res) => { res.status(403).send("Forbidden!") })
    process.on('SIGINT', async () => {
        await db.stopDb()
        process.exit(0);
    })
    app.listen(port, () => {
        console.log('Express started. Listening on %s', port);
    });
}

startServer();
