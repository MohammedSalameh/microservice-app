// k port-forward nats-depl-59975c4d-v5fcl 4222:4222 / 8222:8222
import { connect } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});


stan.on('connect', () => {
    console.log('Listener connected to NATS'); 

    

    new TicketCreatedListener(stan).listen();
});