## Overview
This tool allows you to easily check the availability of web services. 
All services available in the tool must be defined in a JSON file. 
## Setup
Prerequisites: Node.js
1. Install dependencies: **npm install** 
2. Create .api.env & .web.env file (see **Environment Variables**)
3. Create a JSON with a list of all services (see **Services**)
### Startup Command
    node --env-file=.api.env server.js

## Docker
To build the docker container run this command: 
    
    docker buildx build --load -t serviceavailabilitycheck:latest . 

To build and run the docker container run this command: 

    docker compose up --env-file=.api.env -d --build

## Environment Variables
### API
This is a list of all possible environment variables for the .api.env file: 
| Variable | Description |
|---|---|
| PORT | Set the port (if variable is not provided, the port 80 will be set) |
| DEFAULTPAGE | page that is served for the root |
| ROUTENOTFOUND | page that is served if the route is not valid |
| SERVICES | JSON containing all services |
| PINGCOUNT | How many Ping instructions are sent (if variable is not provided, 1 ping instruction will be sent) |
| LOG_LOCALE | Locale for the date time format of the log file |
| MIN_LOG_LEVEL | Sets which events are logged (INFO, WARNING, ERROR) |
| MARIADB_ROOT_PASSWORD | Password of the rootuser of the database |
| MARIADB_USER | Username of the application user |
| MARIADB_PASSWORD | Password of the application user |
| MARIADB_DATABASE | Name of the database |
| MARIADB_URL | URL of the database |
| DBPORT | Port of the database |

## Services
All services available in the tool must be defined in a JSON file. 
The name of the JSON file must be defined by the **environment variable** SERVICES.
The JSON must at least contain the following data in the services section: 
- name: Displayname 
- shortname: Sub-Description 
- logo: path to the logo-image file
- route: term that must be used in the route (e.g.: /healthCheck/service/"route")
- url: Full domain name (for display use)
- ping: URL / IP that is used for the ping command (without protocol!)
- port: port of the service
- type: N = Netcat / P = Ping
- refreshing: indicates if the service is currently beeing refreshed

The tool must not be restarted to add services. The JSON can be updated on the fly!
### Example: 
See services-example.json!
