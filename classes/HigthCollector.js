import {
    HigthModel,
    CollectorsStatus
} from '../models';
import axios from 'axios';
import async from 'async';

export class HigthCollector {
    constructor() {
        this._pointInQuery = 512;
        this._queryWasDone = 0;
        this._queryHaveErr = 0;
        this.city = 'Tomsk';
        this._timer = null;
        this._planTimer = null;
    }

    init(config) {
        this._apiKey = config.apiKey;
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
        this._queryLimit = config.queryLimit;
        this._queryDelayMs = config.queryDelayMs;
        
        return this._checkStatus()
            .then(() => this.startCollect())
            .catch(err => console.log(err));
    };

    _createQuery() {
        let endPoint = `${this._currentPoint.x.toFixed(5)},${(this._currentPoint.y + this._step * this._pointInQuery).toFixed(5)}`
        let path = `path=${this._currentPoint.x.toFixed(5)},${this._currentPoint.y.toFixed(5)}|${endPoint}`;
        let queryUrl = `${this._apiURL}json?${path}&samples=${this._pointInQuery}&key=${this._apiKey}`;
        if (this._currentPoint.x === this._endPoint.x) {
            this._currentPoint.x = this._startPoint.x;
            this._currentPoint.y += this._step * this._pointInQuery;
        } else {
            this._currentPoint.x += this._step;
        }
        return queryUrl;
    };

    _checkStatus() {
        return new Promise((resolve, reject) => {
            async.waterfall([
                cb => CollectorsStatus.find({}, (err, res) => err ? cb(err) : cb(null, res)),
                (res, cb) => {
                    if (res.length) {
                        this._currentPoint.x = res[0].higthCollector.currentX;
                        this._currentPoint.y = res[0].higthCollector.currentY;
                        this._queryWasDone = res[0].higthCollector.queryWasDone;
                        cb(null);
                    } else {
                        let status = new CollectorsStatus({
                            higthCollector: {
                                city: this.city,
                                currentX: this._startPoint.x,
                                currentY: this._startPoint.y,
                                queryWasDone: 0,
                                queryHaveErr: []
                            }
                        });
                        status.save(err => {
                            if (err) {
                                cb(err);
                            } else {
                                this._currentPoint = this._startPoint;
                                cb(null);
                            }
                        });
                    }
                }], err =>  err ? reject(err) : resolve());
        });
    };

    startCollect() {
        this._timer = setInterval(() => {
            if (this._queryWasDone > this._queryLimit) {
                this._queryWasDone = 0;
                this.stopCollect();
                this.planNext();
            } else {
                let url = this._createQuery();
                async.waterfall([
                    cb => axios.get(url).then(res => 
                            res.data.status === 'OK' ? cb(null, res.data.results, null) : cb(null, null, res.data.error_message))
                            .catch(err => cb(err)),
                    (data, msg, cb) => {
                        if (msg) {
                            const findDoc = { city: this.city },
                                updDoc = {
                                    $set: {
                                        queryHaveErr: [{
                                            url: url,
                                            errMsg: answ.error_message }]
                                    }
                                };
                            CollectorsStatus.findOneAndUpdate(findDoc, updDoc, err => err ? cb(err) : cb(null));
                        } else {
                            console.time()
                            let elv = data.map(point => new HigthModel({
                                elevation: point.elevation,
                                lat: point.location.lat,
                                lng: point.location.lng,
                                resolution: point.resolution
                            }));
                            console.timeEnd();
                            HigthModel.insertMany(elv, err => err ? cb(err) : cb(null));
                        }
                    }
                ], err => err ? console.log(err) : null);
            }
        }, this._queryDelayMs);
    };

    stopCollect() {
        clearInterval(this._timer);
    };

    planNext() {
        this._planTimer = setTimeout(() => this.startCollect(), 24*60*60*1000);
    };
    
    cancelPlan() {
        clearTimeout(this._planTimer);
    };
}
//https://maps.googleapis.com/maps/api/elevation/json?
//path=36.578581,-118.291994|36.23998,-116.83171
//&samples=3
//&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk