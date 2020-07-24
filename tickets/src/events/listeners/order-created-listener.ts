import { Listener, OrderCreatedEvent, Subjects, NotFoundError } from '@mjtickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Fin the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)
        // no ticket throw error
        if(!ticket) {
            throw new NotFoundError();
        }
        // mark the ticket as reserved by setting its orderId property
        ticket.set({ orderId: data.id});
        // save the ticket
        await ticket.save();
        // let dependent services know about this change
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            price: ticket.price,
            title: ticket.title,
            orderId: ticket.orderId,
            userId: ticket.userId
        });
        
        // ack the message
        msg.ack();
    }
}