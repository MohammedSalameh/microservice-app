import { Ticket } from '../ticket';

it('Implements optimistic concurrency control', async (done) => {

    // Create instance of ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '234'
    });
    // Save the ticket to the database
    await ticket.save();
    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    // make two seperate changes to the tickets we fetched
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});
    // save the first fetched ticket
    await firstInstance!.save();
    // save the second fetched ticket (outdated versioning) and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }

    throw new Error('Should not reach this point');
});

it('Increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '234'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})
