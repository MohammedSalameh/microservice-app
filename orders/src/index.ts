import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';


const start = async () => {
    console.log('Starting up...');
    
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
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


        new TicketUpdatedListener(natsWrapper.client).listen();
        new TicketCreatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000.!');
    });
};

start();