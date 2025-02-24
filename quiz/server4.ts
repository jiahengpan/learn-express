// import fs from 'fs';
// import path from 'path';
// import express, { Express, Request, Response, NextFunction } from 'express';
// import cors from 'cors';

// const app = express();
// const port = 8000;
// const dataFile = '../data/users.json';


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


import { promises as fsPromises } from 'fs';
import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import readRouter from './readUsers';
import writeRouter from './writeUsers';
import { User } from './types';

const app: Express = express();
const port: number = 8000;
const dataFile = '../data/users.json';

// Read users 
async function readUsersFile() {
    try {
        console.log('reading file ... ');
        const data = await fsPromises.readFile(path.resolve(__dirname, dataFile));
        app.locals.users = JSON.parse(data.toString());
        console.log('File read successfully');
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
}

// Initialize application
async function initialize() {
    // Read initial users data
    await readUsersFile();

    // Configure middleware
    app.use(cors({ origin: 'http://localhost:3000' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Mount routers
    app.use('/read', readRouter);
    app.use('/write', writeRouter);

    // Start server
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

// Start the application
initialize().catch(console.error);

export default app;