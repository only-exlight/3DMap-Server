const fs = require('fs');
const CONFIG_FILE_NAME = require('../consts/app.const').CONFIG_FILE_NAME;
const CONFIG_FOOLDER = require('../consts/app.const').CONFIG_FOOLDER;

export const readAppConfig = () => {
    try {
        let config = fs.readFileSync(`./${CONFIG_FOOLDER}/${CONFIG_FILE_NAME}`);
        return JSON.parse(config);
    } catch (err) {
        console.log('Ошибка в конфигурации!', err)
        process.exit(1);
    }
}
