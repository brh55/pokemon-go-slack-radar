# Pokemon-Go-Slack-Scanner
![Poke Go Logo](http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/092015/pokemongo.png?itok=LERVo0L9)

![Repo Version](https://img.shields.io/github/tag/brh55/pokemon-go-slack-scanner.svg?style=flat-square&label=version)
[![Build Status](https://travis-ci.org/brh55/pokemon-go-slack-scanner.svg?branch=master)](https://travis-ci.org/brh55/pokemon-go-slack-scanner) [![Dependency Status](https://david-dm.org/brh55/pokemon-go-slack-scanner.svg)](https://david-dm.org/brh55/pokemon-go-slack-scanner)

Pokemon Go Slack Scanner is a slash command that allows you to scan for pokemon based on an inputted address. 

## Configuration
The configuration of the bot are set with environment variables using an `.env` file. Please look at the `example.env` file of possible configurations, and create an updated `.env` file before you deploy.


_.env_

```
PORT = 5000

# HEX Color of update notification
UPDATE_COLOR = "#27ae60"

GOOGLE_API_TOKEN = ASADAaisai1928axzstuz
SLACK_TOKEN = jsadj2019a099wPxkkl
```

## Setting Up Slack Slash Command
Set up the command to POST a request to your web server url

```http://yourwebserver.com/```

## Google API Key Registration
This Slack bot requires a Google Decoder API In order to properly decode addresses. Visit the [Google Developers Portal](https://console.developers.google.com/flows/enableapi?apiid=maps_backend,geocoding_backend,directions_backend,distance_matrix_backend,elevation_backend,places_backend&keyType=CLIENT_SIDE&reusekey=true) to generate a token to use for this site.

## Automated Set Up with Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Deploying Steps

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


## Post Deployment - Test

After your app has deployed, go to your server url and go to the `/check` endpoint.

Example:
```
http://myherokuapp.heroku.com/debug
```
If you've successfully deployed, you should get a successful message stating *Successful Set-up* along with a table of configurations to verify against.

If set up was unsuccessful, you should get a message to verify your configurations, along with important configurations that the server has set up.

## License
This repository is protected under the MIT License.

## Contribute
Contributions are welcomed. This is in the early stages (still plagued with bad code D:) so feel free to submit and report any issues.
