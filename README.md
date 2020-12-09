# Microservice E-commerce app
Simple e-commerce app with Docker/Kubernetes (ingress-nginx), Typescript, ReactJS and NextJS.

NATS-Server as a messaging protocol between services.

Stripe API is used for payments.

Databases POSTGRES & MongoDB (mongoose) to handle account information and versioning control between services. Information is encrypted!

## Docker/Kubernetes
If you are trying to run this app you need to do either one of the following 2 steps:

* *In either step, edit all the yaml files in ```infra/k8s/``` with tag **image** to your own dockerhub accountid. ```image: acountid/x:latest```*

1: Edit the tag "host" in ```infra/k8s/ingress-srv.yaml``` (if unsure this is the file: [ingress-srv.yaml](https://github.com/MohammedSalameh/microservice-app/blob/master/infra/k8s-dev/ingress-srv.yaml) to 127.0.0.1)

2: **OBS:** Do this at your **own risk**, remove after development.

  * Edit the Hosts file (with admin rights):  
  * copy this in run: ```%SystemRoot%/system32/drivers/etc/hosts``` and add: ```127.0.0.1 ticketing.dev``` at the end and save.
  
Also go into the infra-dev/prod and change all the repositories to your image on docker hub. 
      
## Ingress-nginx
Make sure you are using the correct ingress-nginx as this project:

  If you are familiar with ingress-nginx, at the time, this version was used (run in terminal with admin rights): ```kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml```  
  
   Otherwise here is the proper [Github](https://github.com/kubernetes/ingress-nginx) & [Guide](https://kubernetes.github.io/ingress-nginx/deploy)
