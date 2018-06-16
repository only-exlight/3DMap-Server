import { Router } from 'express';
import { CollectorsStatus } from '../models';

export const CollectorsApi = Router();

CollectorsApi.get('/*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    let find = {collectorType: req.params['0']}
    CollectorsStatus.findOne(find, (err, doc) => {
        res.end(JSON.stringify(doc));
        next();
    })
})