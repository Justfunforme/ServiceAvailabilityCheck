## Setup
Prerequisites: Node.js
1. Install Express: npm install express
2. Create .env file (see **Env Variables**)
3. Create a JSON with a list of all services (see **Services**)
### Startup Command
node --env-file=.env server.js

## Env Variables
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
### Example: 
{
    "services": [
        {
            "name": "Google",
            "route": "google",
            "url": "https://google.com",
            "ping": "google.com"
        }
    ]
}
