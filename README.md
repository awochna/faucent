# Faucent #

(Currently non-functional, a work-in-progess)

A modern, open-source cryptocurrency faucet that makes sense.

## Setup ##

Assuming you already have a JSON RPC client for your coin set up.

* Install Nodejs 6 or greater: https://nodejs.org/en/
* Install MongoDB: https://docs.mongodb.com/manual/installation/
* Clone this repository: `git clone http://github.com/awochna/faucent`
* Copy the default settings file (`cp settings.default.json settings.json`) and change the settings in `settings.json` to your liking and environment.
* Run with `npm start` or run a cluster if you have multiple cores with `npm run cluster`.
* The server should now be running on the port you specified (default `4050`).

You're good to go!

Although, you probably want to set up an nginx reverse proxy and have it handle SSL termination, but that's beyond this README.

## Contributing ##

Please create an issue if you encounter problems using this software.
The more detail you can add about your issue, the better.

When contributing your code, please be thorough in your commit messages and follow our code of conduct.
