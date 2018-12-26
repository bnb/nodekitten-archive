const request = require('request')
const Twitter = require('twit')
const semver = require('semver')
const fs = require('fs')

// Define variables for the application
const twitterConsumerKey = process.env.CONSUMER_KEY
const twitterConsumerSecret = process.env.CONSUMER_SECRET
const twitterAccessToken = process.env.ACCESS_TOKEN
const twitterAccessTokenSecret = process.env.ACCESS_TOKEN_SECRET
let url = 'https://nodejs.org/dist/index.json'

// Main function
// Calls: diffVersons
const nodekitten = () => {
  request(url, function (error, response, body) {
    if (error) throw error
    let raw = JSON.parse(body)
    diffVersions(raw)
  })
}

const writeVersions = (json) => {
  fs.writeFile('data/releases.json', json, (error) => {
    if (error) throw error
    console.log('JSON has been written to data/release.json')
  })
}

// Expects stringified JSON to be passed
// Calls: composeTweet
const diffs = (localJSON, remoteJSON) => {
  let local = JSON.parse(localJSON)
  let remote = JSON.parse(remoteJSON)
  let localArray = []
  let remoteArray = []

  for (let property in local) {
    localArray.push(semver.valid(semver.coerce(local[property].version)))
  }

  for (let property in remote) {
    remoteArray.push(semver.valid(semver.coerce(remote[property].version)))
  }

  let diff = remoteArray.filter(semver => !localArray.includes(semver))

  diff.forEach(function (version) {
    composeTweet(version)
  })
}

// Build and send it
const composeTweet = (version) => {
  const tweet = `There's a new @nodejs release available! Node.js v${version} is out now! 🙀\n\n$ nvm install ${version}\n\n🔗 Release post (will be) here:\nhttps://nodejs.org/en/blog/release/${version}/`

  sendTweet(tweet)
}

// Expects raw/parsed JSON to be passed
const diffVersions = (json) => {
  let data = JSON.parse(fs.readFileSync('./data/releases.json'))
  let normalizedLocalJSON = JSON.stringify(data)
  let normalizedRemoteJSON = JSON.stringify(json)

  if (normalizedLocalJSON !== normalizedRemoteJSON) {
    diffs(normalizedLocalJSON, normalizedRemoteJSON)
    writeVersions(normalizedRemoteJSON)
  } else if (normalizedLocalJSON === normalizedRemoteJSON) {
    console.log('No new versions have been released.')
  } else {
    console.log('Something is wrong with either the remote JSON data or the local JSON data...')
  }
}

// Use the Twitter API to send out a Tweet, and console.log() that it's happened!
const sendTweet = (tweetContent) => {
  if (process.env.NODE_ENV === 'production') {
    const twitterAPI = new Twitter({
      consumer_key: twitterConsumerKey,
      consumer_secret: twitterConsumerSecret,
      access_token: twitterAccessToken,
      access_token_secret: twitterAccessTokenSecret,
      timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
    })

    twitterAPI.post('statuses/update', { status: tweetContent }, (error, data, response) => {
      if (error) throw error
      console.log(`\n~~ PRODUCTION MODE ~~`)
      console.log(`\nThere's a new version out! Tweeting it: \n\n${tweetContent}\n`)
    }
    )
  } else {
    console.log(`\n~~ DEVELOPMENT MODE ~~`)
    console.log(`\nThere's a new version out! Here's what the tweet would look like: \n\n${tweetContent}\n`)
  }
}

// Start the Application
module.exports = nodekitten
