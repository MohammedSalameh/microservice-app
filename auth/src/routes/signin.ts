import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@mjtickets/common';
import { Password } from '../miscellaneous/password';

const router = express.Router();

router.post('/api/users/signin', [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must supply a password')
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            throw new BadRequestError('Invalid Credentials');
        }

        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        if(!passwordsMatch) {
            throw new BadRequestError('Invalid Credentials');
        }
        // Generate JWT
        // kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf 
        // sharing secrets between pods to verify jwt
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
            },
            process.env.JWT_KEY!
        );
        // Store it on session object
        req.session = {
            jwt: userJwt,
            isChanged: false,
            isPopulated: false
        };

        res.status(200).send(existingUser);
});

export {router as signinRouter};