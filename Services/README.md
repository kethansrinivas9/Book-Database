##########################################################################
	This is the readme file for Services module
##########################################################################
Follow the below steps

1. The Services module contains all the end-user accessible UI/Backend services

2. To create a docker image from this module run the following command 
   docker build -t kethansrinivas9/services:latest -f dockerfile .

3. Once the docker image is ready, we can use it to run and test the docker service using the following  command docker run -e "MACHINE_IP=${MACHINE_IP}" -d --name services -p 3000:3000 kethansrinivas9/services
