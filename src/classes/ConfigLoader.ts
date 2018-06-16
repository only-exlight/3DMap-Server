import { readdirSync, readFileSync } from 'fs';
import { basename } from 'path';
import { toCamelCase } from 'to-camel-case';

export class ConfigLoader {
    private _foolder: string;
    public configs: any; // ??
    constructor(configFoolder:string) {
        this._foolder = configFoolder;
        this.configs = { };
    }

    read() {
        return new Promise((resolve, reject) => {
            try {
                let configFiles = readdirSync(`./${this._foolder}`);
                configFiles.forEach(file => 
                    this.configs[toCamelCase(basename(file, 'json'))] = 
                    JSON.parse(readFileSync(`./${this._foolder}/${file}`).toString()));
                    resolve(this.configs);
            } catch (err) {
                reject(err);
            }
        })
        
    }
}