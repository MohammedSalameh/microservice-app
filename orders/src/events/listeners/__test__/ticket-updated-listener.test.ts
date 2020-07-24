import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@mjtickets/common';
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';


const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 23
    });
    await ticket.save();

    // create fake data and msg object
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'no concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, ticket };
};

it('finds, updates, and saves a ticket', async () => {
    const {listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.version).toEqual(data.version);
    expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const {listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped/incremented version number', async () => {
    const {listener, data, msg } = await setup();
    data.version = 10;
    
    try {
        await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
});


