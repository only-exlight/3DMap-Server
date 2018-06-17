import { Router } from 'express';
import { HigthModel, HigthModelDocument } from '../models';
import { waterfall } from 'async';
import { ImgHelper } from '../classes';
let imageLib = require('../../node_modules/imagelib/imageLib.js');

export const ClientApi = Router();

ClientApi.get('/get-higthmap', (req, res) => {
    if (req.query.startx && req.query.starty && req.query.endx && req.query.endy) {
        waterfall([
            (cb: Function) => {
                HigthModel.find({
                    point: {
                        $geoWithin: {
                            $box: [
                                [req.query.startx, req.query.starty],
                                [req.query.endx, req.query.endy]
                            ]
                        }
                    }
                }, (err: any, docs: HigthModelDocument) => err ? cb(err) : cb(null, docs))
            },
            (docs: HigthModelDocument [], cb: Function) => {
                console.time();
                const imgWidth: number = ImgHelper.getImgWidth(req.query.startx, req.query.endx);
                const imgHeight: number = ImgHelper.getImgHeigth(req.query.starty, req.query.endy);
                const elev: number [] = docs.map((doc: HigthModelDocument) => doc.elevation);
                const maxElev: number = Math.max(...elev);
                const minElev: number = Math.min(...elev);
                console.log(imgWidth, imgHeight);
                console.timeEnd()
                imageLib(imgWidth, imgHeight).create(function() {
                    console.time()
                    docs.forEach((doc:HigthModelDocument) => {
                        const color: number = ImgHelper.elevationToColor(minElev, maxElev, doc.elevation);
                        const x: number = ImgHelper.xPositionPixel(req.query.startx, doc.point.coordinates["0"]);
                        const y: number = ImgHelper.yPositionPixel(req.query.starty, doc.point.coordinates["1"]);
                        this.setPixel(x, y, color, color, color);
                    });
                    const fd = this.jpeg_encode.encode(this, 85);
                    const bf: Buffer = new Buffer(fd);
                    console.timeEnd()
                    cb(null, bf);
                });
            }
        ], (err, img: Buffer) => {
            if (err) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'application/json');
                res.status(500);
                res.end(JSON.stringify({
                    status: 'ERR',
                    msg: 'Data base error'
                }))
            } else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'image/jpeg');
                res.send(img);
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