##########################################################################
	This is the readme file for Catalogue module
##########################################################################
Follow the below steps

1. The Catalogue module contains all the APIs for Catalogue

2. To create a docker image from this module run the following command 
   docker build -t kethansrinivas9/catalogue:latest -f dockerfile .

3. Once the docker image is ready, we can use it to run and test the docker service using the following  command docker run -d --name catalogue -p 3002:3002 kethansrinivas9/catalogue
