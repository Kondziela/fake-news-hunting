import * as fs from "fs";
import {FakeNewsModel} from "../models/models";

export class FileTools {

    public saveToJSON(result: string, name: string) {
        fs.writeFile(name, result,{encoding: 'utf8'}, (err) => {
            if (err) console.error(err);
            else console.log('Saved JSON');
        })
    }

    public saveToCSV(results: Array<FakeNewsModel>, name: string) {
        const resultsCSV = ['Verdict;Title;Text;URL;ID'].concat(
            // @ts-ignore
            results.map(result => `${result.verdict};${result.title};${result.text};${result.url};${result.id}`)
        ).join('\n');
        fs.writeFile(name, resultsCSV,{encoding: 'utf8'}, (err) => {
            if (err) console.error(err);
            else console.log('Saved CSV');
        })
    }

    public readFile(fileName: string, callbackFn) {
        fs.readFile(fileName, (err, data) => callbackFn(data));
    }
}