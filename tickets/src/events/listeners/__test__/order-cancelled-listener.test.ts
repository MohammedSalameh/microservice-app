import { Message } from 'node-nats-streaming';
import { OrderStatus, OrderCancelledEvent} from '@mjtickets/common';
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);


    const orderId = mongoose.Types.ObjectId().toHexString()
    // create and save ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 33,
        userId: '123',
    });
    ticket.set({orderId});
    await ticket.save();

    // Create fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg, orderId };
};


it('should update the  ticket, publishes , and acks the message ', async () => {
    // split into 3 seperate tests...
    
    const { listener, ticket, data, msg, orderId } = await setup();
    await listener.onMessage(data, msg); 

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

