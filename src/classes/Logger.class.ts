import chalk from 'chalk';
import { createWriteStream }  from 'fs';
import { LOGS_FILE, LOGS_FOOLDER, 
    ERR, LOGGER, OPEN_FILE, WRITE_FILE, SUCCESS } from '../consts';
import { LOGS_TYPES } from '../enums';

export class Logger {
    private _logFoolder = LOGS_FOOLDER;
    private _stream = createWriteStream(`./${LOGS_FOOLDER}/${LOGS_FILE}`);
    constructor() { }

    public log(type, msg, err?) {
        
        let curType: string = null;
        switch (type) {
            case LOGS_TYPES.ERR: curType = 'red';
                break;
            case LOGS_TYPES.WARN: curType = 'yellow';
                break;
            case LOGS_TYPES.INFO: curType = 'blue';
                break;
        }
        const logMsg = `${new Date()} ${msg}\n`;
        console.log(`${chalk.magenta(new Date().toString())} ${chalk[curType](msg)}`);
        this._stream.write(logMsg, err => this._writeFileCb(err));
        if (err) {
            console.log(err)
        }  
    }

    private _openFileCb(err: any) {
        if (err) {
            console.log(`${chalk.magenta(new Date().toString())} ${chalk.red(`${LOGGER}: ${OPEN_FILE} - ${ERR}`)}`);
            console.log(err);
        } else {
            console.log(`${chalk.magenta(new Date().toString())} ${chalk.blue(`${LOGGER}: ${OPEN_FILE} - ${SUCCESS}`)}`);
        }

    }
    private _writeFileCb(err: any) {
        if (err) {
            console.log(`${chalk.magenta(new Date().toString())} ${chalk.red(`${LOGGER}: ${WRITE_FILE} - ${ERR}`)}`);
            console.log(err);
        } else {
            console.log(`${chalk.magenta(new Date().toString())} ${chalk.blue(`${LOGGER}: ${WRITE_FILE} - ${SUCCESS}`)}`)
        }
    }
}