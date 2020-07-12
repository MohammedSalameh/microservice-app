import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { deleteOrderRouter } from './routes/delete';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';

import { ErrorHandler, NotFoundError, currentUser } from '@mjtickets/common';


const app = express();
app.set('trust proxy', true);// traffic is going through ingress-nginx, trust it.
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' //For jest, to run on http instead of https
    })
);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);

//unexisting routes (must be before errorhandler)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };