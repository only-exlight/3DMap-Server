import express from 'express';
import bodyParser from 'body-parser';
import { readAppConfig } from './function/config-loader';
import mongoose from 'mongoose';
import { Logger } from './classes';
import imageLib from './node_modules/imagelib/imagelib';
import { SUCCESS, ERR, LISTEN, CONECTING,
    DB, SERVER,
    PUBLIC_FOOLDER } from './consts';

const conf = readAppConfig(),
    logger = new Logger(),
    app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/${PUBLIC_FOOLDER}`));

mongoose.connect(conf.dbServer, err =>
    err ? logger.log(logger.types.ERR, `${DB}: ${CONECTING} - ${ERR}`, err) :
    logger.log(logger.types.ERR, `${DB}: ${CONECTING} - ${SUCCESS}`)
);
app.listen(conf.appPort, err => 
    err ? logger.log(logger.types.INFO, `${SERVER}: ${ERR}`, err) :
    logger.log(logger.types.INFO, `${SERVER}: ${LISTEN} ${conf.appPort}`)
);
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=YOUR_API_KEY
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk

/*
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