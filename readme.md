# Pokemon-Go-Slack-Radar
![Repo Version](https://img.shields.io/github/tag/brh55/pokemon-go-slack-radar.svg?style=flat-square&label=version)
[![Build Status](https://travis-ci.org/brh55/pokemon-go-slack-radar.svg?branch=master)](https://travis-ci.org/brh55/pokemon-go-slack-radar)
[![Dependency Status](https://david-dm.org/brh55/pokemon-go-slack-radar.svg)](https://david-dm.org/brh55/pokemon-go-slack-radar)

![Poke Radar](http://cdn.bulbagarden.net/upload/thumb/a/a7/Poke_Radar.png/200px-Poke_Radar.png)

`pokemon-go-slack-radar` is a simple slash command that allows you to scan for nearby pokemon based on a selected address every X seconds for X minutes. It's powered and __dependent__ of [Pokemon Vision](http://pokemonvision.com), a free Pokemon scanning tool, thus `pokemon-go-slack-radar` may not function properly without warning.

    Caveats:
       - Google Geocoder API has a 1000 request daily limit, and 150k request limit after a card is registered.
       - The Geocoder service can take a wide range of addresses, but YMMV based on the accuracy of your inputs
    Disclaimer:
       - Still apparent bugs for interval scans

![temporary image](https://cloud.githubusercontent.com/assets/6020066/17226559/f39044e6-54be-11e6-9206-f6d81008a50b.png)

## Getting started
Setting up `pokemon-go-slack-radar` requires 4 main steps:
   
   1. Setting up Slack Custom Slash Commands
   2. Retrieving Necessary Tokens (Slack and Google Geocoder API _(or alternative decoding service)_)
   3. Configuring `pokemon-go-slack-radar` and Deploying
   4. Scan the sh!4z out of areas


### Setting Up Slack
Setting up the command to POST a request to the `pokemon-go-slack-radar`.

![Slack Setup](https://cloud.githubusercontent.com/assets/6020066/17226408/397b5172-54be-11e6-9d28-6829daa42798.png)

### Tokens
This Slack bot requires 2 tokens: Google Geocoder API, and Slack. (__alternatively, a different decoder can be used, but has not been tested__)

##### Google Geocoder API
Visit the [Google Developers Portal](https://console.developers.google.com/flows/enableapi?apiid=maps_backend,geocoding_backend,directions_backend,distance_matrix_backend,elevation_backend,places_backend&keyType=CLIENT_SIDE&reusekey=true) on how to generate a token.

##### Slack
Visit the [Slack Token Page](https://www.google.com/#q=slack+token) for more information regarding how to generate your organizations token.

### Configuration & Deployment

##### Heroku Quick Deploy
If you would like to use [Heroku](https://www.heroku.com/) as a service provider, feel free to use the quick deploy button to ease the set up process.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

#### Manual Configuration
The configuration of the bot are set with environment variables using an `.env` file. Please look at the `example.env` file of possible configurations, and create an updated `.env` file before you deploy.

_.env_

```
PORT = 5000

# HEX Color of update notification
UPDATE_COLOR = "#27ae60"

GOOGLE_API_TOKEN = ASADAaisai1928axzstuz
SLACK_TOKEN = jsadj2019a099wPxkkl
```

### Deploying Steps

1. Set up the address of your server to configure where your outgoing hooks should be sent to. (ex: myapp.heroku.com)
2. Clone or download/unzip this repo to your serer
3. Adjust your `.env` file as outlined above
4. Install [Node.js](http://nodejs.org/) on your server if not done so already
5. Install repo dependencies
  
  ```bash
  $ cd to/repo
  $ npm install
  ```
6. Start the server

  ```bash
  $ npm start
  ```

### Post-Deployment - Test & Debugging
After your app has deployed, go to your server url and go to the `/check` endpoint. To verify if your setting are correct.

Example:
```
http://myherokuapp.heroku.com/debug
```

If you've successfully deployed, you should get a successful message stating *Successful Set-up* along with a table of configurations to verify against.

If set up was unsuccessful, you should get a message to verify your configurations, along with important configurations that the server has set up.

### Usage
Use the custom hook that was set up to initiate prompt:

```
/pokeradar scan [address] every [interval time] seconds for [duration] minutes
```

__Example Usage__

Will scan chinatown repeatingly for 5 minutes
![chinatown example](https://cloud.githubusercontent.com/assets/6020066/17226333/d5376aac-54bd-11e6-9de5-cc433f7ee1a0.png)

Will scan berlin once
![berlin example](https://cloud.githubusercontent.com/assets/6020066/17226391/1beeebf0-54be-11e6-8831-fd3a15cc1a91.png)

## License
This repository is protected under the MIT License.

## Contribute
Contributions are welcomed! This is in the early stages, and still rough around the edges. Feel free to submit and report any issues.
