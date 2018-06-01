let express = require('express'),
    bodyParser = require('body-parser'),
    https = require('https'),
    app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());

app.get('/get-matrix', (req,res) => {
    https.get('https://maps.googleapis.com/maps/api/elevation/json?locations=56.450971,%2084.950748&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk',
    resp => {
        console.log(resp.on('data', ss => res.send(ss + '')))
    });
    
})

app.listen(8000,() => console.log('Server is start on port 8000'));