# NodeKitten

> A [Node.js Twitter bot](https://twitter.com/nodekitten) to Tweet Node.js Releases 😸

## How to Start the App

Be sure to install dependencies first:

```
npm install
```

You will need to pass a few environment variables (`GITHUB_TOKEN`, `CONSUMER_KEY`, `CONSUMER_SECRET`, `ACCESS_TOKEN`, and `ACCESS_TOKEN_SECRET`)in with your GitHub token and Twitter API credentials. See the Setup subheading for more details.


You can start the application by running the `app.js` file with Node.js:

```
node app.js
```

## Deploy Version
There is currently a hard-coded variable called `deployVersion`. This will set the inital version that the bot is deployed with. If the current version check matches the deploy version, no tweet will be sent out.

If you want to test what the message will look like, you'll want to set the deploy version to something other than the latest release on the [Node.js releases page](https://github.com/nodejs/node/releases).

There are still some rough edges around this and the `previousVersion` variable (which could be merged). Going to be working on this in the future 👍

## Setup: What's Missing from this Repository

There's a bit of code that's missing from this repo. Specifically, my `now.json` file has been ignored via `.gitignore` becuase it contains both my GitHub and Twitter auth tokens for API calls.

If you _don't_ want to deploy to ZEIT's Now, you can just pass the environment variables as... environment variables, wherever you're running your application. For local testing, I use the following command:

```
GITHUB_TOKEN="" CONSUMER_KEY="" CONSUMER_SECRET="" ACCESS_TOKEN="" ACCESS_TOKEN_SECRET="" node app.js
```
Here's a template of what _my_ `now.json` file looks like, with those tokens redacted:

```JSON
{
  "env": {
    "NODE_ENV": "production",
    "GITHUB_TOKEN": "",
    "CONSUMER_KEY": "",
    "CONSUMER_SECRET": "",
    "ACCESS_TOKEN": "",
    "ACCESS_TOKEN_SECRET": ""
  }
}
```
### Guide to Needed/Used Environment Variables
`NODE_ENV`: Should be `production` unless you want to deploy a development environment. Will only be considered production ready with this environment variable set to `production`.

`GITHUB_TOKEN`: Your GitHub personal token. This bot will use some of your 5k hourly requests (depending on what the `INTERVAL` variable is set to).

`CONSUMER_KEY`: Twitter Consumer Key. Can be obtained from setting up Twitter API access from an account.

`CONSUMER_SECRET`: Twitter Consumer Secret. Can be obtained from setting up Twitter API access from an account.

`ACCESS_TOKEN`: Twitter Access Token. Can be obtained from setting up Twitter API access from an account.

`ACCESS_TOKEN_SECRET`: Twitter Consumer Key. Can be obtained from setting up Twitter API access from an account.
