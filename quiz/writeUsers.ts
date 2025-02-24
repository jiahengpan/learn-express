
import express, { Response, NextFunction } from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { User, UserRequest } from './types';

const router = express.Router();

// Middleware to add users to request
const addUsersToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.app.locals.users) {
        req.users = req.app.locals.users;
        next();
    } else {
        return res.json({
            error: { message: 'users not found', status: 404 }
        });
    }
};

router.use('/adduser', addUsersToRequest);

router.post('/adduser', async (req: UserRequest, res: Response) => {
    try {
        let newuser = req.body as User;
        req.app.locals.users.push(newuser);
        
        await fsPromises.writeFile(
            path.resolve(__dirname, '../data/users.json'),
            JSON.stringify(req.app.locals.users)
        );
        
        console.log('User Saved');
        res.send('done');
    } catch (err) {
        console.log('Failed to write:', err);
        res.status(500).send('Error saving user');
    }
});

export default router;