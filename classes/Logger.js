import colors from 'colors'
import fs from 'fs'
import { LOGS_FILE, LOGS_FOOLDER, 
    ERR, LOGGER, OPEN_FILE, WRITE_FILE, SUCCESS,
    LOGS_TYPES } from '../consts'

export class Logger {
    constructor() {
        this._logFoolder = LOGS_FOOLDER;
        this.types = LOGS_TYPES;
        this.stream = fs.createWriteStream(`./${LOGS_FOOLDER}/${LOGS_FILE}`, err => this._openFileCb(err));
        colors.setTheme({
            info: 'cyan',
            warn: 'yellow',
            err: 'red',
            time: 'magenta'
        })
    }

    log(type, msg, err) {
        const logMsg = `${new Date()} ${msg}\n`;
        console.log(`${colors.time(new Date())} ${colors[type](msg)}`);
        this.stream.write(logMsg, err => this._writeFileCb(err));
        if (err) {
            console.log(err)
        }  
    }

    _openFileCb(err) {
        if (err) {
            console.log(`${colors.time(new Date())} ${colors.err(`${LOGGER}: ${OPEN_FILE} - ${ERR}`)}`);
            console.log(err);
        } else {
            console.log(`${colors.time(new Date())} ${colors.info(`${LOGGER}: ${OPEN_FILE} - ${SUCCESS}`)}`);
        }

    }
    _writeFileCb(err) {
        if (err) {
            console.log(`${colors.time(new Date())} ${colors.err(`${LOGGER}: ${WRITE_FILE} - ${ERR}`)}`);
            console.log(err);
        } else {
            console.log(`${colors.time(new Date())} ${colors.info(`${LOGGER}: ${WRITE_FILE} - ${SUCCESS}`)}`)
        }
    }
}