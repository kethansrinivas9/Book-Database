##########################################################################
	This is the readme file for Notes module
##########################################################################
Follow the below steps

1. The Notes module contains all the APIs for Notes

2. To create a docker image from this module run the following command 
   docker build -t kethansrinivas9/notes:latest -f dockerfile .

3. Once the docker image is ready, we can use it to run and test the docker service using the following  command docker run -d --name notes -p 3002:3002 kethansrinivas9/notes
