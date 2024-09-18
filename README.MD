## Overview
This tool allows you to easily check the availability of web services. 
All services available in the tool must be defined in a JSON file. 
## Setup
Prerequisites: Node.js
1. Install Express: 

    npm install

2. Create .env file (see **Environment Variables**)
3. Create a JSON with a list of all services (see **Services**)
### Startup Command
    node --env-file=.env server.js

## Docker
Run 
    
    docker buildx build --load -t serviceavailabilitycheck:latest . 

to build the App as a Docker container. 

Run 

    docker compose up -d --build

to build and run the container. 

## Environment Variables
This is a list of all possible environment variables for the .env file: 
- PORT=3332 -> set the Port (if variable is not provided, the port 3000 will be set)
- DEFAULTPAGE=index.html -> page that is served for the root
- ROUTENOTFOUND=notFound.html -> page that is served if the route is not valid
- ALLHEALTHCHECKROUTES=services.json -> JSON containing all services
- PINGCOUNT=3 -> How many Ping instructions are sent (if variable is not provided, 1 ping instruction will be sent)

## Services
All services available in the tool must be defined in a JSON file. 
The name of the JSON file must be defined by the **env variable** ALLHEALTHCHECKROUTES.
The JSON must at least contain the following data in the services section: 
- name: Displayname 
- route: term that must be used in the route (e.g.: /healthCheck/service/"route")
- url: Full domain name (for display use)
- ping: URL / IP that is used for the ping command (without protocol!)

The tool must not be restarted to add services. The JSON can be updated on the fly!
### Example: 
See services-example.json!
