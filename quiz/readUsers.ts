// import express, { Response } from 'express';
// const router = express.Router();


import express, { Response, NextFunction } from 'express';
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

// middleware to routes
router.use('/usernames', addUsersToRequest);
router.use('/username/:name', addUsersToRequest);

// Route to get all usernames
router.get('/usernames', (req: UserRequest, res: Response) => {
    let usernames = req.users?.map((user) => {
        return { id: user.id, username: user.username };
    });
    res.send(usernames);
});

// Route to get email by username
router.get('/username/:name', (req: UserRequest, res: Response) => {
    const searchName = req.params.name;
    const user = req.users?.find(user => user.username === searchName);
    
    if (user) {
        res.send({ email: user.email });
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});

export default router;