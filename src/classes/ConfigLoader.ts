import { readdirSync, readFileSync } from 'fs';
import { basename } from 'path';
import * as toCamelCase from 'to-camel-case';

export class ConfigLoader {
    public configs: any; // ??
    private _foolder: string;
    
    constructor(configFoolder:string) {
        this._foolder = configFoolder;
        this.configs = { };
    }

    public read() {
        return new Promise((resolve, reject) => {
            try {
                const configFiles: string [] = readdirSync(`./${this._foolder}`);
                configFiles.forEach((fileName: string) => {
                    let confName: string = basename(fileName, '.json');
                    confName = toCamelCase(confName);
                    const file: string = readFileSync(`./${this._foolder}/${fileName}`).toString();
                    this.configs[confName] = JSON.parse(file);
                }); 
                resolve(this.configs);
            } catch (err) {
                reject(err);
            }
        });
    }
}