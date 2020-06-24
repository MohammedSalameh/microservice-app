import axios from 'axios';

export default ({ req }) => {

    if (typeof window === 'undefined') {
        //on the server! requests should be made to ingress-nginx
        return axios.create({
            baseURL:'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        //on the browser! requests can be made with a base url of ''
        return axios.create({
            baseURL: '/'
        });
    }
};