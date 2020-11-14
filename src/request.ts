import * as fs from 'fs';
import * as request from 'request-promise';
import {FakeHunterResponse, FakeNewsModel} from "./models/models";

export class Request {

    private numberOfPages: number = 50;

    public downloadAllFakeHistory(): Promise<Array<FakeNewsModel>> {
        const requests = [];

        for (let i = 1; i<this.numberOfPages; i++) {
            requests.push(this.callForFakeNews(i));
        }

        return new Promise<Array<FakeNewsModel>>(resolve => {
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
                                domain: d.url.split('/')[2],
                                twitterId: d.url.split('/').pop(),
                                id: d.id
                            }})
                        }
                    }).filter(d => !!d);
                    resolve(results);
                });
        });
    }

    private callForFakeNews(pageNumber: number): Promise<FakeHunterResponse> {
        return new Promise<FakeHunterResponse>(resolve => {
            request.get(`https://panel-api.fakehunter.pap.pl/news/published/news?page=${pageNumber}`)
                .then(results => resolve(JSON.parse(results)))
                .catch(() => resolve())
        });
    }

}
