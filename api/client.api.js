import express from 'express';
import imageLib from '../node_modules/imagelib/imageLib';

export const ClientApi = express.Router();

ClientApi.get('/', (req, res) => {
    res.setHeader('content-type', 'image');
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
    })
})