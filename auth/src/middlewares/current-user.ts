import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


interface UserPayload {
    id: string;
    email: string;
}

// add additional property to express requests
declare global { 
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.session?.jwt) { //? is the same as !req.session just shorter
        return next();
    }

    //verify jwt from user request
    try{
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY! // we already checked for this in the startup ../index.ts
        ) as UserPayload;

        req.currentUser = payload;
    } catch (err) {

    }

    next();
};