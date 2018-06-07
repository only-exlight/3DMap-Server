import express from 'express';
import bodyParser from 'body-parser';
import { readAppConfig } from './function/config-loader';
import mongoose from 'mongoose'
/*let https = require('https'),
    imgLib = require('./node_modules/imagelib/imageLib'),
    getHandler =require('./function/promises-wrappers').getHandler,
    getRequest = require('./function/promises-wrappers').getRequest,*/
const conf = readAppConfig(),
    app = express();

app.use(bodyParser.json());
app.use('/',)
mongoose.connect(conf.dbServer, err => console.log('База данных подключена'));
app.listen(conf.appPort, () => console.log(`Сервер запущен на порту ${conf.appPort}`));
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=YOUR_API_KEY
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk

/*
app.use(express.static(`${__dirname}/public`));

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
*/