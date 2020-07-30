import { OrderCancelledEvent, OrderStatus } from '@mjtickets/common';
import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 10,
        userId: 'sdfasdf'
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'asdf',
            price: 10
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, data, msg}
};

it('should update the status of the order', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);


    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});


