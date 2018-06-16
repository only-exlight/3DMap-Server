import { setTheme, yellow, cyan, red, magenta,  } from 'colors'
import { createWriteStream }  from 'fs'
import { LOGS_FILE, LOGS_FOOLDER, 
    ERR, LOGGER, OPEN_FILE, WRITE_FILE, SUCCESS,
    LOGS_TYPES } from '../consts'

export class Logger {
    private _logFoolder = LOGS_FOOLDER;
    private _stream = createWriteStream(`./${LOGS_FOOLDER}/${LOGS_FILE}`);
    public 
    constructor() {
        setTheme({
            info: cyan,
            warn: yellow,
            err: red,
            time: magenta
        })
    }

    public log(type, msg, err) {
        const logMsg = `${new Date()} ${msg}\n`;
        console.log(`${time(new Date())} ${colors[type](msg)}`);
        this._stream.write(logMsg, err => this._writeFileCb(err));
        if (err) {
            console.log(err)
        }  
    }

    private _openFileCb(err: any) {
        if (err) {
            console.log(`${colors.time(new Date())} ${colors.err(`${LOGGER}: ${OPEN_FILE} - ${ERR}`)}`);
            console.log(err);
        } else {
            console.log(`${colors.time(new Date())} ${colors.info(`${LOGGER}: ${OPEN_FILE} - ${SUCCESS}`)}`);
        }

    }
    private _writeFileCb(err: any) {
        if (err) {
            console.log(`${colors.time(new Date())} ${colors.err(`${LOGGER}: ${WRITE_FILE} - ${ERR}`)}`);
            console.log(err);
        } else {
            console.log(`${colors.time(new Date())} ${colors.info(`${LOGGER}: ${WRITE_FILE} - ${SUCCESS}`)}`)
        }
    }
}