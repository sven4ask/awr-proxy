# AWR Proxy Service

This AWR Proxy Service discloses the AWR API for a specific project name.

## Setting up

Installing the project is done by running `npm install`.

In the configuration file you need to set your token. It's also possible to change your port (which defaults to 1337).

## Running

Local your start the project by running `npm start`. To run in on production set the NODE_ENV to production:
`NODE_ENV=production npm start`.

I would highly recommand using pm2. To ensure the project keeps running.

## Usage

You can create one or more accounts per project. Simply add an account to the production config file. 

```
{
  "accounts" : {
     "username": { // Username
        "password": "passsword",
        "project": "projectname" // Name of the project in AWR
     }
  }
}
```


