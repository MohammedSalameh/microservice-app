import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from '@mjtickets/common';


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data;
        const ticket = await Ticket.findByEvent(data);
        
        if(!ticket) {
            throw new NotFoundError();
        }
        ticket.set({
            title, price
        });
        await ticket.save();

        msg.ack();
    }
}