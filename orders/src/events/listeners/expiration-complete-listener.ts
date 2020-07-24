import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Subjects, Listener, ExpirationCompleteEvent, NotFoundError, OrderStatus } from '@mjtickets/common';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order) {
            throw new NotFoundError();
        }
        //dont cancel an order that has been paid for
        if(order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        
        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            }
        });

        msg.ack();
    }
}