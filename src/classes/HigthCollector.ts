import { HigthModel, CollectorsStatus } from '../models';
import { HigthCollectorConfig, GoogleElevationResponse, GoogleElevation } from '../interfaces';
import axios, { AxiosResponse } from 'axios';
import { waterfall } from 'async';

export class HigthCollector {
    public city = 'Tomsk';
    private _pointInQuery = 512;
    private _queryWasDone = 0;
    private _timer: NodeJS.Timer = null;
    private _planTimer: NodeJS.Timer = null;
    private _apikey: string;
    private _apiURL: string;
    private _step: number;
    private _queryLimit: number;
    private _queryDelayMs: number;
    private _startPoint: any; // ??
    private _endPoint: any; // ??
    private _currentPoint: any; // ??

    constructor() { }

    init(config: HigthCollectorConfig) {
        this._apikey = config.apiKey;
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

    public startCollect() {
        this._timer = setInterval(() => {
            if (this._queryWasDone >= this._queryLimit) {
                this.stopCollect();
                this.planNext();
            } else {
                let url = this._createQuery();
                waterfall([
                    (cb: Function) => 
                        axios.get(url).then((res: AxiosResponse<GoogleElevationResponse>) => 
                            res.data.status === 'OK' ? cb(null, res.data.results, null) : cb(null, null, res.data.error_message))
                            .catch(err => cb(err)),
                    (data: GoogleElevation[], msg: string, cb: Function) => {
                        this._queryWasDone++;
                        if (msg) {
                            const findDoc = { city: this.city },
                                updDoc = {
                                    $set: {
                                        queryWasDone: this._queryWasDone,
                                        queryHaveErr: [{
                                            url: url,
                                            errMsg: msg }]
                                    }
                                };
                            CollectorsStatus.findOneAndUpdate(findDoc, updDoc, err => err ? cb(err) : cb(msg));
                        } else {
                            console.time()
                            let elv = data.map((point: GoogleElevation) => new HigthModel({
                                elevation: point.elevation,
                                lat: point.location.lat.toFixed(5),
                                lng: point.location.lng.toFixed(5),
                                resolution: point.resolution
                            }));
                            console.timeEnd();
                            HigthModel.insertMany(elv, err => err ? cb(err) : cb(null, this._currentPoint.x, this._currentPoint.y));
                        }
                    },
                    (x: number, y: number, cb: Function) => CollectorsStatus.update({ city: this.city }, { $set: {
                        queryWasDone: this._queryWasDone,
                        currentX: x.toFixed(5),
                        currentY: y.toFixed(5)
                    }}, err => err ? cb(err) : cb(null))
                ], err => err ? console.log(err) : null);
            }
        }, this._queryDelayMs);
    };

    public stopCollect() {
        clearInterval(this._timer);
    };

    public planNext() {
        this._queryWasDone = 0;
        this._planTimer = setTimeout(() => 
            this.startCollect(), 24*60*60*1000 - this._queryLimit * this._queryDelayMs);
    };
    
    public cancelPlan() {
        clearTimeout(this._planTimer);
    };

    private _createQuery() {
        let endPoint = `${this._currentPoint.x.toFixed(5)},${(this._currentPoint.y + this._step * this._pointInQuery).toFixed(5)}`
        let path = `path=${this._currentPoint.x.toFixed(5)},${this._currentPoint.y.toFixed(5)}|${endPoint}`;
        let queryUrl = `${this._apiURL}json?${path}&samples=${this._pointInQuery}&key=${this._apikey}`;
        if (this._currentPoint.x === this._endPoint.x) {
            this._currentPoint.x = this._startPoint.x;
            this._currentPoint.y += this._step * this._pointInQuery;
        } else {
            this._currentPoint.x += this._step;
        }
        return queryUrl;
    };

    private _checkStatus() {
        return new Promise((resolve, reject) => {
            const find = { collectorType: 'higth-collector' };
            waterfall([
                cb => 
                    CollectorsStatus.findOne(find, (err, doc: Document) => err ? cb(err) : cb(null, doc)),
                (doc: any, cb: Function) => {
                    if (doc) {
                        this._currentPoint.x = doc.currentX;
                        this._currentPoint.y = doc.currentY;
                        if (new Date(doc.lastStart).getDate() === new Date().getDate()){
                            this._queryWasDone = doc.queryWasDone;
                        } else {
                            this._queryWasDone = 0;
                        }
                        cb(null);
                    } else {
                        let status = new CollectorsStatus({
                                collectorType: 'higth-collector',
                                city: this.city,
                                currentX: this._startPoint.x,
                                currentY: this._startPoint.y,
                                queryWasDone: 0,
                                queryHaveErr: [],
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
}
//https://maps.googleapis.com/maps/api/elevation/json?
//path=36.578581,-118.291994|36.23998,-116.83171
//&samples=3
//&key=AIzaSyBKuJapDGNbls_9_vVbBC8GarwC8M2oBzk