const express = require('express')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2))
const port = argv["port"] || 5000
const app = express()

const help = (`
server.js [options]
--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help, -h	Return this message and exit.
`)
// If --help, echo help text and exit
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}

//functions
function coinFlip() {
    const result = Math.random();
    if(result < .5) {
      return "heads";
    } else {
      return "tails";
    }
  }
  function coinFlips(flips) {
    const results = [];
    for(i=0; i <flips; i++) {
      results[i] = coinFlip();
    }
    return results;
  }
  function countFlips(array) {
    var head = 0;
    var tail = 0;

    for(i=0; i<array.length; i++) {
      if(array[i] == 'heads') {
        head++;
      } else {
        tail++;
      }
    }
    return {heads: head, tails: tail};
  } 
  function flipACoin(call) {
    let flip = coinFlip()
    const obj = { call: call, flip: flip, result: 'lose' }
    if (call == flip) {
        obj.result = 'win';
    }
    return obj;
  }
//functions  


// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

// checkpoints and endpoints

app.get('/app/', (req, res) => { // checkpoint
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
});

// Flip a coin endpoint
app.get('/app/flip/', (req, res) => {

    //res.status(200).json({"flip" : coinFlip()})
    
    res.statusCode = 200;
    res.statusMessage = 'OK';
    
    // flip a coin
    const result = coinFlip();

    // check if result = heads or tails
    if(result == "heads") {
        res.json({"flip":"heads"});
    } else {
        res.json({"flip":"tails"});
    }
});

// Flip multiple coins
app.get('/app/flips/:number', (req, res) => {
    
    //res.statusCode = 200;
    //res.statusMessage = 'OK';
    
    // Flip multiple coins and store results
    //const result = coinFlips(req.params.number);
    //res.status(200).json({"raw" : result, "summary" : countFlips(result)})

    const flips = coinFlips(req.params.number);
    res.status(200).json({"raw": flips, "summary" : countFlips(flips)})

    //const count = countFlips(result);

    //res.json({"raw":result, "summary":count})

});


// Guess Heads
app.get('/app/flip/call/heads', (req, res) => {
    //res.status(200).json(flipACoin("tails"))
    res.statusCode = 200;
    res.statusMessage = 'OK';

    // Flip multiple coins and store results
    const result = flipACoin('heads');
    res.json(result);

});

// Guess Tails
app.get('/app/flip/call/tails', (req, res) => {
    //res.status(200).json(flipACoin("heads"))
    res.statusCode = 200;
    res.statusMessage = 'OK';

    // Flip multiple coins and store results
    const result = flipACoin('tails');
    res.json(result);

});


// Default response for any other request
app.use(function(req, res) {
    res.status(404).send('404 NOT FOUND')
});