import { Request } from './request';
import {TwitterRequest} from "./twitterRequest";
import {Tools} from "./Tools";
import {FakeNewsModel} from "./models/models";
import {MorfeuszRequest} from "./morfeuszRequest";
import {SentimentAnalyze} from "./sentimentAnalyze";

const tools = new Tools();
const twitter = new TwitterRequest();
const morfeusz = new MorfeuszRequest();
const sentiment= new SentimentAnalyze();

// new Request().downloadAllFakeHistory()
//     .then(results => {
//         console.log(`Downloaded ${results.length} records from Fake Hunter Page`);
//         // tools.saveToCSV(results);
//         // tools.saveToJSON(JSON.stringify(results));
//         const twitterFakes = results.filter(result => result.domain.includes('twitter'));
//         console.log(`Number of fakes related to Twitter: ${twitterFakes.length}`)
//         Promise.all(twitterFakes.map(twitt => getTwittDetails(twitt)))
//             .then(twitts => {
//                 console.log('Downloaded details from Twitter');
//                 tools.saveToJSON(JSON.stringify(twitts), 'fakeWithTwitts.json')
//             })
//     });

const getTwittDetails = (data: FakeNewsModel): Promise<object> => {
    return new Promise<object>(resolve => {
        twitter.getDetailsOfTweet(data.twitterId)
            .then(twitt => {
                data.twitterDetails = twitt;
                resolve(data);
            })
    });
}

const queue = [];

tools.readFile('fakeWithTwittsTexts.json', (buffer: Buffer) => {
    const morfeuszAnalyze = JSON.parse(new String(buffer).toString()).filter(data => data.twitterDetails).map(data => {
        data.sentiment = sentiment.getSentimentPolish(data.twitterDetails);
        return data;
    });

    morfeuszRequest(morfeuszAnalyze);
});


const morfeuszRequest = (data: Array<FakeNewsModel>) => {
    const value = data.pop();
    if (value) {
        analyzeMorfeusz(value)
            .then(result => {
                queue.push(result);
                console.log(`Processed: ${queue.length}, Left: ${data.length}`);
                setTimeout(() => morfeuszRequest(data), 1000);
            })
    } else {
        console.log(queue.length);
        tools.saveToJSON(JSON.stringify(queue), 'fakeWithMorfeuszAndSentiment.json');
    }
};

const analyzeMorfeusz = (data: FakeNewsModel): Promise<FakeNewsModel> => {
    return new Promise<FakeNewsModel>(resolve => {
        // @ts-ignore
        morfeusz.tagFromMorfeusz(data.twitterDetails)
        .then(result => {
            data.morfeuszWords = morfeusz.filterMorfeuszValues(result).map(morfeusz => morfeusz.coreValue.split(':')[0]);
            resolve(data);
        });
    });
}

// morfeusz.tagFromMorfeusz('Siema mam pewną sprawę?')
//     .then(result => {
//         console.log(morfeusz.filterMorfeuszValues(result));
//     });

// new TwitterRequest().getDetailsOfTweet('1326281517392420866');