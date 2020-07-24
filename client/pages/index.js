const LandingPage = ({ currentUser }) => {
    return currentUser ? (<h1>You are signed in</h1>) : (<h1>You aren't signed in</h1>);
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
    return {};
};

export default LandingPage;