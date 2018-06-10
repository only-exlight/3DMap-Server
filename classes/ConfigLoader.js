import fs from 'fs';
import path from 'path';
import camel from 'to-camel-case';

export class ConfigLoader {
    constructor(configFoolder) {
        this._foolder = configFoolder;
        this.configs = { };
    }

    read() {
        return new Promise((resolve, reject) => {
            try {
                let configFiles = fs.readdirSync(`./${this._foolder}`);
                configFiles.forEach(file => 
                    this.configs[camel(path.basename(file, 'json'))] = 
                    JSON.parse(fs.readFileSync(`./${this._foolder}/${file}`)));
                    resolve(this.configs);
            } catch (err) {
                reject(err);
            }
        })
        
    }
}