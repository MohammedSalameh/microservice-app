import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

//unexisting routes (must be before errorhandler)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(ErrorHandler);

export { app };