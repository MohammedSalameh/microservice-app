import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError, BadRequestError } from '@mjtickets/common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();


router.put('/api/tickets/:id', requireAuth, [
    body('title')
        .not() //not provided
        .isEmpty() //string is empty
        .withMessage('Title is requried'),
    body('price')
        .isFloat({ gt: 0})
        .withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    }

    if(ticket.orderId) {
        // if true, then do NOT allow edits
        throw new BadRequestError('Ticket is reserved and cannot be editted');
    }
    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    res.send(ticket);
});



export { router as updateTicketRouter }