import { HigthModel, CollectorsStatus } from '../models';

export class HigthCollector {
    constructor() {
        this._pointInQuery = 512;
    }

    init(config) {
        this._apiKey = config._apiKey;
        this._apiURL = config.apiUrl;
        this._startPoint = {
            x: config.startPoint.x,
            y: config.startPoint.y
        };
        this._endPoint = {
            x: config.endPoint.x,
            y: config.endPoint.y
        };
        this._currentPoint = {
            x: null,
            y: null
        };
        this._step = config.step;
        this._maxQueryCount = config.maxQueryCount;
        return this._checkStatus();
    }

    _createQuery() {
        for (let i = this.startPoint.x; i <= this.endPoint.x; i += this.step) {

        }
    }

    _checkStatus() {
        return new Promise((resolve, reject) => {
            CollectorsStatus.find({ }, (err, res) => {
                err && reject(err);
                if (res.length) {
                    this._currentPoint.x = res[0].higthCollector.currentX;
                    this._currentPoint.y = res[0].higthCollector.currentY;
                } else {
                    let status = new CollectorsStatus({
                        higthCollector: {
                            city: 'Tomsk',
                            currentX: this._startPoint.x,
                            currentY: this._startPoint.y
                        }
                    });
                    status.save(err => {
                        if (err) {
                            reject(err);
                        } else {
                            this._currentPoint = this._startPoint;
                            resolve();
                        }
                    });
                }
            });
        });
    }
}
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=YOUR_API_KEY
//https://maps.googleapis.com/maps/api/elevation/json?path=36.578581,-118.291994|36.23998,-116.83171&samples=3&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk