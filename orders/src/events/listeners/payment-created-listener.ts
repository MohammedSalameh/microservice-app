import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Subjects, Listener, PaymentCreatedEvent, NotFoundError, OrderStatus } from '@mjtickets/common';
import { Order } from '../../models/order';


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new NotFoundError();
        }

        order.set({
            status: OrderStatus.Complete
        });

        // no reason to publish a order:updated event since it is complete
        // but can be implemented if needed in the future.

        await order.save();

        msg.ack();
    }
}