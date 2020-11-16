import {FakeNewsModel} from "./models/models";
import * as path from "path";
import {FileTools} from "./tools/file-tools";
import {FakeHunterRequest} from "./requests/fake-hunter.request";
import {TwitterRequest} from "./requests/twitter.request";
import {MorfeuszRequest} from "./requests/morfeusz.request";
import {SentimentAnalyze} from "./tools/sentiment-analyze";

export class Main {

    private tools: FileTools;
    private fakeHunterRequest: FakeHunterRequest;
    private twitterRequest: TwitterRequest;
    private morfeuszRequest: MorfeuszRequest;
    private sentimentAnalyze: SentimentAnalyze;

    constructor() {
        this.tools = new FileTools();
        this.fakeHunterRequest = new FakeHunterRequest();
        this.twitterRequest = new TwitterRequest();
        this.morfeuszRequest = new MorfeuszRequest();
        this.sentimentAnalyze = new SentimentAnalyze();
    }

    public readRecordsFromFakeHunterAnalyzeAndSave() {
        this.fakeHunterRequest.downloadAllFakeHistory()
            .then(results => {
                console.log(`Downloaded ${results.length} records from Fake Hunter Page`);
                const twitterFakes = results.filter(result => result.domain.includes('twitter'));
                console.log(`Number of fakes related to Twitter: ${twitterFakes.length}`)
                Promise.all(twitterFakes.map(twitt => this.getTwittDetails(twitt)))
                    .then((fakeHunterDetailsArray) => {
                        console.log('Downloaded details from Twitter');
                        // @ts-ignore
                        this.textAnalyze(fakeHunterDetailsArray);
                    })
            });
    }

    private getTwittDetails(data: FakeNewsModel): Promise<FakeNewsModel> {
        return new Promise<FakeNewsModel>(resolve => {
            this.twitterRequest.getDetailsOfTweet(data.twitterId)
                .then(twitt => {
                    data.twitterDetails = twitt;
                    resolve(data);
                })
        });
    }

    private textAnalyze(data: Array<FakeNewsModel>) {
        console.log('Start text analyze');
        // filter out data without twitter details
        const morfeuszAnalyze = data.filter(data => data.twitterDetails).map(data => {
            data.sentiment = this.sentimentAnalyze.getSentimentPolish(data.twitterDetails.full_text);
            return data;
        });

        console.log('Start Morfeusz analyze');
        this.callMorfeuszRequest(morfeuszAnalyze, []);
    }

    private callMorfeuszRequest(data: Array<FakeNewsModel>, queue: Array<FakeNewsModel>) {
        const value = data.pop();
        if (value) {
            this.analyzeMorfeusz(value)
                .then(result => {
                    queue.push(result);
                    console.log(`Processed: ${queue.length}, Left: ${data.length}`);
                    setTimeout(() => this.callMorfeuszRequest(data, queue), 1000);
                })
        } else {
            console.log(queue.length);
            this.tools.saveToJSON(JSON.stringify(queue), path.join('src', 'data', 'fakeWithMorfeuszAndSentiment.json'));
        }
    };

    private analyzeMorfeusz(data: FakeNewsModel): Promise<FakeNewsModel> {
        return new Promise<FakeNewsModel>(resolve => {
            this.morfeuszRequest.tagFromMorfeusz(data.twitterDetails.full_text)
                .then(result => {
                    data.morfeuszWords = this.morfeuszRequest.filterMorfeuszValues(result).map(morfeusz => morfeusz.coreValue.split(':')[0]);
                    resolve(data);
                });
        });
    }

}