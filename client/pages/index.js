import Link from 'next/link';
const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        )
    });
    

    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    );
};

//IF DOCKER/KUBERNETES: MAKE SURE TO ROUTE CORRECTLY
// Setup a external name service that will map correctly or do it manually
// kubectl get namespaces

// 1. Hard refresh of page, clicking link from a different domain, typing in url bar
//      all of which will be executed on the server
// 2. navigating from one page to antoher while in the app
//      is executed on the client
//      e.g. is when you get redirected when signingup.
LandingPage.getInitialProps = async (context, client, currentUser) => {
    //fetch data during serverside rendering process (only RENDERED once)
    //any data returned from here will be accessible in the above method
    console.log('LANDING PAGE');
    const { data } = await client.get('/api/tickets');

    return { tickets: data};
};

export default LandingPage;