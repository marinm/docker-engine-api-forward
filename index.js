const express = require('express');
const http = require('http');

const PORT = 9996;
const SOCKET_PATH = '/var/run/docker.sock';

const app = express();

function cors(req, res, next) {
    res.set({
        'Content-Type'                : 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });
    next();
}

// The API sometimes returns arrays [...]
// Wrap arrays in { "list": [...] } to make receiving the message easier
// Never mind, not necessary
// function toObject(object) {
//     return Array.isArray(object)? {list: object} : object;
// }

function fromJSON(string) {
    try {
        return JSON.parse(string);
    }
    catch {
        return null;
    }
}

function notJSON(string) {
    try {
        return { result: String(string) }
    }
    catch {
        return null;
    }
}

function get(path, receiver) {
    // A more complete example:
    // https://nodejs.org/api/http.html#httpgetoptions-callback

    const request = http.request(
        {
            socketPath: SOCKET_PATH,
            path: path
        },
        function(response) {
            response.setEncoding('utf8');

            // The response may be loaded in multiple chunks
            const chunks = [];

            response.on('data', (data) => chunks.push(data));
            response.on('end', () => receiver(chunks.join('')));
            response.on('error', () => receiver(null));
        }
    );
    request.end();
}

app.get('/*', cors, function(req, res) {
    get(req.path,
        function receiver(data) {
            res.send( fromJSON(data) || notJSON(data) || {error: "JSON"} );
        }    
    );
});

app.listen(PORT);