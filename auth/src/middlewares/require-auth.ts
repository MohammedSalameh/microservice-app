import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../errors/not-authorized-error';


export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Assuming that the user is not logged in
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
};