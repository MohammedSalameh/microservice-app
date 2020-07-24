import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if(!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit(); 
        });
        // This is to combat the scenario where a crashed listener doesnt result in multiple subscriptions channels.
        // Although windows/mac/linux doesnt always use the same SIGINT/SIGTERM
        process.on('SIGINT', () => natsWrapper.client.close()); //Interupt signals, close client first and dont send me more messages
        process.on('SIGTERM', () => natsWrapper.client.close());// Termination signals

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.log(err);
    }
};

start();