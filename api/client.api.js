import express from 'express';
import imageLib from '../node_modules/imagelib/imageLib';
import { HigthModel } from '../models';
import waterfall from 'async/waterfall';

export const ClientApi = express.Router();

ClientApi.get('/get-higthmap', (req, res) => {
    if (req.query.startx && req.query.starty && req.query.endx && req.query.endy) {
        const findX = {
            lat: { $gte: req.query.startx, $lte: req.query.endx },
        };
        const findY = {
            lng: { $gte: req.query.starty, $lte: req.query.endy}
        }
        const xField = { lat : 1,  elevation: 1 }, yField = { lng: 1, elevation: 1 };
        const xFieldSrt = { lat : 1 }, yFieldSrt = { lng: 1 };
        let xEle = [], yEle = [];
        waterfall([
            cb => HigthModel.find(findX, xField, (err, x) => err ? cb(err) : cb(null, x)).sort(xFieldSrt),
            (x, cb) => HigthModel.find(findY, yField, (err, y) => err ? cb(err) : cb(null, x, y)).sort(yFieldSrt),
            (x, y, cb) => {
                res.setHeader('Content-Type', 'application/json'/*'image/jpeg'*/);
                console.time();
                let objX = {}, objY = {};
                x.forEach(x => {
                    let str = x.lat;
                    objX[str] = true;
                });
                y.forEach(y => {
                    let str = y.lng;
                    objY[str] = true;
                });
                let answ = JSON.stringify({
                    x: Object.keys(objX),
                    y: Object.keys(objY)
                });
                console.timeEnd();
                res.send(answ);
                cb(null)
            }
        ], (err, img) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(500);
                res.end(JSON.stringify({
                    status: 'ERR',
                    msg: 'Data base error'
                }))
            } else {
                res.end();
            }
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            status: 'ERR',
            msg: 'Request is not valid! Example: domain.com/api/client/get-higthmap?startx=56.3212&starty=56.3212&endx=80.02&endy=80.02'
        }))
    }
    /*
    imageLib(200, 200).create(function () {
        let x, y;
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
    })*/
})