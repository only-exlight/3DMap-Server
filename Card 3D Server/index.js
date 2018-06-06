let express = require('express'),
    bodyParser = require('body-parser'),
    https = require('https'),
    app = express();
    imgLib = require('./node_modules/imagelib/imageLib'),
    getHandler =require('./function/promises-wrappers').getHandler,
    getRequest = require('./function/promises-wrappers').getRequest,
    appConfigLoader = require('./function/config-loader');

let config = appConfigLoader();

console.log(config)
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());

getHandler('/get-image', app)
    .then(({ req, res }) => {
        res.setHeader('content-type', 'image');
        imgLib(200, 200).create(function () {
            var x, y;

            for (x = 20; x < 180; x++) {
                for (y = 20; y < 40; y++) {
                    this.setPixel(x, y, 255, 0, 0, 255); // black
                }
            }

            for (y = 0; y < this.height; y++) {
                this.setPixel(0, y, 255, 0, 0, 255);
                this.setPixel(this.width - 1, y, 255, 0, 0, 255);
            }

            for (x = 0; x < this.width; x++) {
                this.setPixel(x, 0, 255, 0, 0, 255);
                this.setPixel(x, this.height - 1, 255, 0, 0, 255);
            }
            let fd = this.jpeg_encode.encode(this, 85)
            let bf = new Buffer(fd)
            res.send(bf);
            res.end();
        })
    })

const a = [56.4737, 85.0288],
    b = [56.4737, 85.0289],
    c = [56.4738, 85.0289],
    d = [56.4738, 85.0288];
const key = 'AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk';

getHandler('/get-matrix', app).then(({ req, res }) => {
    let promises = [];
    let answers = [];
    for (let i = a[0]; i <= c[0]; i += .000001) {
        for (let j = a[1]; j <= c[1]; j += .000001) {
            console.log(i,j)
            let url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${i.toFixed(6)},${j.toFixed(6)}&key=${key}`
            //promises.push(getRequest(url,https));
        }
    }
    Promise.all(promises).then(value => console.log('value'))
})

app.listen(config.appPort, () => console.log('Server is start on port 8000'));
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=YOUR_API_KEY
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk