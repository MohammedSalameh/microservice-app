import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

//global CSS MUST BE IN YOUR CUSTOM <App>
const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
    <div>
        <Header currentUser={currentUser}/>
        <div className="container">
            <Component currentUser={currentUser} {...pageProps} />
        </div>
    </div>
    );
};

// req/res is nested inside ctx in NextJS
AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    //also load index.js getInitialProps
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser); 
    }
    
    //and pass to appropriate data
    return {
        pageProps,
        ...data
    }

};

export default AppComponent;