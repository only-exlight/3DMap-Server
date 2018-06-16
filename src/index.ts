import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Logger, HigthCollector, ConfigLoader } from './classes';
import { SUCCESS, ERR, LISTEN, CONECTING,
    DB, SERVER,
    PUBLIC_FOOLDER, CONFIG_FOOLDER } from './consts';
import { ClientApi, CollectorsApi } from './api';

const logger = new Logger(),
    app = express(),
    configLoader = new ConfigLoader(CONFIG_FOOLDER),
    higthCollector = new HigthCollector();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/${PUBLIC_FOOLDER}`));
app.use('/api/collectors', CollectorsApi);
app.use('/api/client', ClientApi);
configLoader.read()
    .then(config => higthCollector.init(config.higthCollector))
    .catch(err => console.log(err));

mongoose.connect(configLoader.configs.config.dbServer, err =>
    err ? logger.log(logger.types.ERR, `${DB}: ${CONECTING} - ${ERR}`, err) :
    logger.log(logger.types.INFO, `${DB}: ${CONECTING} - ${SUCCESS}`)
);
app.listen(configLoader.configs.config.appPort, err => 
    err ? logger.log(logger.types.INFO, `${SERVER}: ${ERR}`, err) :
    logger.log(logger.types.INFO, `${SERVER}: ${LISTEN} ${configLoader.configs.config.appPort}`)
);
