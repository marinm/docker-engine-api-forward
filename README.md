# docker-engine-api-forward

## Why

I was having trouble configuring the Docker Engine (on MacOS) to serve the [Engine API](https://docs.docker.com/engine/api/) on TCP on localhost.

I made this script to expose the Unix-domain socket to a TCP port on localhost so I can access the Docker Engine API from my browser.

## Usage

Set `PORT` at the top of `index.js`. Then,

```
npm install
npm start
```

Then, give this a try:

`http://localhost:PORT/v1.41/version`