import express from 'express';
import path from 'path';
import { CollectorsStatus } from '../models';
import async from 'async';

export const CollectorsApi = express.Router();

CollectorsApi.get('/*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    let find = {collectorType: req.params['0']}
    CollectorsStatus.findOne(find, (err, doc) => {
        res.end(JSON.stringify(doc));
        next();
    })
})