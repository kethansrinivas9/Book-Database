##########################################################################
	This is the readme file for Log module
##########################################################################
Follow the below steps

1. The Log module contains all the APIs for Log

2. To create a docker image from this module run the following command 
   docker build -t kethansrinivas9/log:latest -f dockerfile .

3. Once the docker image is ready, we can use it to run and test the docker service using the following  command docker run -d --name log -p 3002:3002 kethansrinivas9/log
