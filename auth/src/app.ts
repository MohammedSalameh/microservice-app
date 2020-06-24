import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import {ErrorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';


const app = express();
app.set('trust proxy', true);// traffic is going through ingress-nginx, trust it.
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' //For jest, to run on http instead of https
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//unexisting routes (must be before errorhandler)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };