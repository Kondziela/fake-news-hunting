import * as fs from 'fs';
import * as request from 'request-promise';
import {FakeHunterResponse} from "./models/models";

export class Request {

    private numberOfPages: number = 50;

    public downloadAllFakeHistory() {
        const requests = [];

        for (let i = 1; i<this.numberOfPages; i++) {
            requests.push(this.callForFakeNews(i));
        }

        Promise.all(requests)
            .then(bodies => {
                // @ts-ignore
                const results = bodies.flatMap(data => {
                    if (!!data) {
                        return data.results.map(d => { return {
                            isFake: d.verdict,
                            title: d.title,
                            text: d.text.replace(/\n/g, ' '),
                            url: d.url,
                            id: d.id
                        }})
                    }
                }).filter(d => !!d);

                this.saveToJSON(JSON.stringify(results));
                this.saveToCSV(results)
            });
    }

    private callForFakeNews(pageNumber: number): Promise<FakeHunterResponse> {
        return new Promise<FakeHunterResponse>(resolve => {
            request.get(`https://panel-api.fakehunter.pap.pl/news/published/news?page=${pageNumber}`)
                .then(results => resolve(JSON.parse(results)))
                .catch(() => resolve())
        });
    }

    private saveToJSON(result: string) {
        fs.writeFile('data.json', result,{encoding: 'utf8'}, (err) => {
            if (err) console.error(err);
            else console.log('Saved JSON');
        })
    }

    private saveToCSV(results: Array<object>) {
        const resultsCSV = ['Is_Fake;Title;Text;URL;ID'].concat(
            // @ts-ignore
            results.map(result => `${result.isFake};${result.title};${result.text};${result.url};${result.id}`)
        ).join('\n');
        fs.writeFile('data.csv', resultsCSV,{encoding: 'utf8'}, (err) => {
            if (err) console.error(err);
            else console.log('Saved CSV');
        })
    }

}
