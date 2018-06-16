import * as express from 'express';
import * as bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { Logger, HigthCollector, ConfigLoader } from './classes';
import * as CONSTS from './consts';
import { ClientApi, CollectorsApi } from './api';
import { LOGS_TYPES } from './enums';

const logger = new Logger(),
    app = express(),
    configLoader = new ConfigLoader(CONSTS.CONFIG_FOOLDER),
    higthCollector = new HigthCollector();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/${CONSTS.PUBLIC_FOOLDER}`));
app.use('/api/collectors', CollectorsApi);
app.use('/api/client', ClientApi);
configLoader.read()
    .then((config: any) => higthCollector.init(config.higthCollector))
    .catch(err => console.log(err));
console.log(configLoader.configs.config);
connect(configLoader.configs.config.dbServer, err =>
    err ? logger.log(LOGS_TYPES.ERR, `${CONSTS.DB}: ${CONSTS.CONECTING} - ${CONSTS.ERR}`, err) :
    logger.log(LOGS_TYPES.INFO, `${CONSTS.DB}: ${CONSTS.CONECTING} - ${CONSTS.SUCCESS}`)
);
app.listen(configLoader.configs.config.appPort, err => 
    err ? logger.log(LOGS_TYPES.INFO, `${CONSTS.SERVER}: ${CONSTS.ERR}`, err) :
    logger.log(LOGS_TYPES.INFO, `${CONSTS.SERVER}: ${CONSTS.LISTEN} ${configLoader.configs.config.appPort}`)
);
