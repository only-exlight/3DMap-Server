import express from 'express';
import bodyParser from 'body-parser';
import { readAppConfig } from './function/config-loader';
import mongoose from 'mongoose';
import { Logger } from './classes';
import { SUCCESS, ERR, LISTEN, CONECTING,
    DB, SERVER,
    PUBLIC_FOOLDER } from './consts';
import { router } from './api';

const conf = readAppConfig(),
    logger = new Logger(),
    app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/${PUBLIC_FOOLDER}`));
app.use('/', router)

mongoose.connect(conf.dbServer, err =>
    err ? logger.log(logger.types.ERR, `${DB}: ${CONECTING} - ${ERR}`, err) :
    logger.log(logger.types.ERR, `${DB}: ${CONECTING} - ${SUCCESS}`)
);
app.listen(conf.appPort, err => 
    err ? logger.log(logger.types.INFO, `${SERVER}: ${ERR}`, err) :
    logger.log(logger.types.INFO, `${SERVER}: ${LISTEN} ${conf.appPort}`)
);
