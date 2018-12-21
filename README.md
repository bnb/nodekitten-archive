# NodeKitten

> A [Node.js Twitter bot](https://twitter.com/nodekitten) to Tweet Node.js Releases 😸

## How to Start the App Locally

Be sure to install dependencies first:

```
npm install
```

You will need to pass a few environment variables (`GITHUB_TOKEN`, `CONSUMER_KEY`, `CONSUMER_SECRET`, `ACCESS_TOKEN`, and `ACCESS_TOKEN_SECRET`)in with your GitHub token and Twitter API credentials. See the Setup subheading for more details.


You can start the application by running the `data/app.js` file with Node.js:

```
node app.js
```

## Deploying With Docker

### Setup: Environment Variables

There's a bit of data that's missing from this repo. Specifically, the environment variables containing the Twitter API keys and setting `NODE_ENV` to `production`.

These are the variables you'll need to set regardless of how you're deploying to production:

```bash
CONSUMER_KEY="<your Twitter API consumer key>"
CONSUMER_SECRET="<your Twitter API consumer secret>"
ACCESS_TOKEN="<your Twitter API access token>"
ACCESS_TOKEN_SECRET="<your Twitter API access token secret>"
NODE_ENV="production"
```

### Deploy: Guide for Azure
I've deployed the Dockerized NodeKitten to Azure using [Azure Container Instances](https://azure.microsoft.com/en-us/services/container-instances/).

I always name the containers I use for this app `nodekitten` and have named the resource group `nodekittenResourceGroup`. If you'd like to use different names, you can change them where they're used.

**Create a Resource Group:**
```
az group create --name nodekittenResourceGroup --location eastus
```

#### Deploy in Development Mode
By deploying without the production evnironment variables, you can make sure everything goes smoothly and there are no issues with the container itself.

**Deploy without Environment Variables:**
```
az container create --resource-group nodekittenResourceGroup --name nodekitten --image bitandbang/nodekitten:latest --dns-name-label nodekitten-dns --ports 80
```

**Kill the Container:**
```
az container delete --resource-group nodekittenResourceGroup --name nodekitten
```


#### Deploy to Prodcution

> **Note:** Make sure you add your Twitter API keys to the empty strings.

**Deploy with Environment Variables:**
```
az container create --resource-group nodekittenResourceGroup --name nodekitten --image bitandbang/nodekitten:latest --dns-name-label nodekitten-dns --ports 80 --environment-variables 'CONSUMER_KEY'='' 'CONSUMER_SECRET'='' 'ACCESS_TOKEN'='' 'ACCESS_TOKEN_SECRET'='' 'NODE_ENV'='production'
```

#### Other Useful ACI Commands for NodeKitten

**Check the status of your deployment:**
```
az container show --resource-group nodekittenResourceGroup --name nodekitten --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table
```

**Pull the container logs:**
```
az container logs --resource-group nodekittenResourceGroup --name nodekitten
```

**Delete the Container:**
```
az container delete --resource-group nodekittenResourceGroup --name nodekitten
```

**Delete the Resource Group:**
```
az group delete --name nodekittenResourceGroup
```


### Context: Environment Variables Required for Production
`NODE_ENV`: Should be `production` unless you want to deploy a development environment. Will only be considered production ready with this environment variable set to `production`.

`CONSUMER_KEY`: Twitter Consumer Key. Can be obtained from setting up Twitter API access from an account.

`CONSUMER_SECRET`: Twitter Consumer Secret. Can be obtained from setting up Twitter API access from an account.

`ACCESS_TOKEN`: Twitter Access Token. Can be obtained from setting up Twitter API access from an account.

`ACCESS_TOKEN_SECRET`: Twitter Consumer Key. Can be obtained from setting up Twitter API access from an account.
