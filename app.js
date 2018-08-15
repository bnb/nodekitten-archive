const octokit = require('@octokit/rest')()
const twitter = require('twit')

// Define variables for the application
const INTERVAL = 15 * 1000 // 25 seconds
const owner   = "nodejs"
const repo    = "node"
const deployVersion = "v10.8.0"
const gitHubToken = process.env.GITHUB_TOKEN
const twitterConsumerKey = process.env.CONSUMER_KEY
const twitterConsumerSecret = process.env.CONSUMER_SECRET
const twitterAccessToken = process.env.ACCESS_TOKEN
const twitterAccessTokenSecret = process.env.ACCESS_TOKEN_SECRET
let previousVersion

// Authenticate with GitHub
octokit.authenticate({
  type: 'token',
  token: gitHubToken
})

// Authenticate with Twitter
const twitterAPI = new twitter({
  consumer_key:         twitterConsumerKey,
  consumer_secret:      twitterConsumerSecret,
  access_token:         twitterAccessToken,
  access_token_secret:  twitterAccessTokenSecret,
  timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
})

// Do the work!
const checkAndSendNewTweet = () => {
  octokit.repos.getLatestRelease({owner, repo}, (error, result) => {
    if (error) {
      throw error
    } else {
      // Set variables for the data we need
      const versionNumber = result.data.tag_name

      // Check if the current version of Node.js pulled from GitHub is the same as the last one tweeted OR the one that the app was deployed with
      if (versionNumber !== previousVersion && versionNumber !== deployVersion) {
      // Content of the tweet
        const tweet = `🙀 There's a new @nodejs release available! Node.js ${versionNumber} is out now.\n🔗 Release post (will be) here:\nhttps://nodejs.org/en/blog/release/${versionNumber}/`

        sendTweet(tweet)
        
        // Once the tweet has been sent, update the previous version number so we don't duplicate content
        previousVersion = versionNumber
      } else {
        if (previousVersion) {
          console.log(`The most recent version NodeKitten tweeted about was: ${previousVersion}\n`)
        } else {
          console.log(`There haven't been any new releases since NodeKitten was deployed! The version it was deployed with was: ${deployVersion}\n`)
        }
      }
    }
  })
}

// Use the Twitter API to send out a Tweet, and console.log() that it's happened!
const sendTweet = (tweetContent) => {
  if(process.env.NODE_ENV === "production") {
    twitterAPI.post('statuses/update', { status: tweetContent }, (error, data, response) => {
      if (error) throw error
      console.log(`~~ PRODUCTION MODE ~~`)
      console.log(`\nThere's a new version out! Tweeting it: \n\n${tweetContent}\n`)
      }
    )
  } else {
    console.log(`~~ DEVELOPMENT MODE ~~`)
    console.log(`There's a new version out! Here's what the tweet would look like: \n\n${tweetContent}\n`)
  }
}

const showRateLimit = () => {
  octokit.misc.getRateLimit({}, (error, result) => {
    console.log(`\n===== GitHub Info =====\n`)
    console.log(`GitHub API Status Code: ${result.status}`)
    console.log(`GitHub API Uses (Total): ${result.data.rate.limit}`)
    console.log(`GitHub Uses Left: ${result.data.rate.remaining}`)
    console.log(`GitHub API Reset in: ${result.data.rate.reset} ms\n`)
  })
}

// Run the function when the application is first run
showRateLimit()
checkAndSendNewTweet()

// Set an interval to check again... and again... and again...
setInterval(checkAndSendNewTweet, INTERVAL)

// TEMPORARY: Hacking around Now's needs for HTTP
const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});