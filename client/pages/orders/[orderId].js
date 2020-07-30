import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method:'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };

        findTimeLeft();// run immediatly instead of waiting 1 sec.
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if(timeLeft < 0) {
        return <div>Order Expired</div>
    }

    return (
        <div>
            Time until reservation expires: {timeLeft} seconds
            <StripeCheckout 
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51H8CCJL1xxbFjGJqf3Fi4Q77P039okPdFoPIzlqPuOvqanEsI1Tf8aXlmxDUb57pHpgFI9zg7V7EnXS453HGKYIO00b6dIwRXQ"
                amount={order.ticket.price*100} //stripe takes amount as cent
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};


OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    
    return {order: data};
}

export default OrderShow;