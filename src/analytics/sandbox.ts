import {FileTools} from "../tools/file-tools";
import {FakeNewsModel, MorfeuszResponse} from "../models/models";
import {FakeHunterRequest} from "../requests/fake-hunter.request";
import {workerData} from "worker_threads";
import {FacebookRequest} from "../requests/facebook.request";
import {TwitterRequest} from "../requests/twitter.request";
import {MorfeuszRequest} from "../requests/morfeusz.request";
import {SentimentAnalyze} from "../tools/sentiment-analyze";
import * as path from "path";

const wordMap = {};


// new FacebookRequest().readFacebookDetails();

// new FileTools().readFile('src/data/originalDataFromFakeNewsHunter.json', (data: Array<FakeNewsModel>) => {
//     data.forEach(d => {
//        const domain = d.url.split('/')[2];
//        if (!wordMap[domain]) {
//            wordMap[domain] = 0;
//        }
//        wordMap[domain]++;
//     });
//
//     console.log(Object.keys(wordMap).map(key => { return {
//         domain: key,
//         number: wordMap[key]
//     }}).sort((o1, o2) => o1.number > o2.number ? -1 : 1));
// });

new FileTools().readFile('src/data/tekstZWerdyktem.json', (data: Array<object>) => {

    data.forEach(d => {
        d['sentiment'] = new SentimentAnalyze().getSentimentPolish(d['originalText'])
    });

    new FileTools().saveToJSON(JSON.stringify(data), 'testZWedyktemISentymentem.json');


    // const twitter = new TwitterRequest();
    // const morfeuszRequest = new MorfeuszRequest();
    // const sentiment = new SentimentAnalyze();
    // Promise.all(data.map(d => d['Link']).map(link => twitter.getDetailsOfTweet(link.split('/').pop())))
    //     .then(data1 => {
    //         const allData = data1.map(d => { return {
    //             text: d.full_text,
    //             sentiment: sentiment.getSentimentPolish(d.full_text)
    //         }}).filter(d => !!d.text);
    //
    //         console.log('Call Morfeusz', allData);
    //         callMorfeuszRequest(allData, []);
    //     })

    // const data: Array<FakeNewsModel> = JSON.parse(new String(buffer).toString());
    // @ts-ignore
    // najczestszeSlowa(data.filter(d => d.verdict !== false));
});


const najczestszeSlowa = (data: Array<FakeNewsModel>) => {
    // @ts-ignore
    data.filter(d => d.verdict === 'false').forEach(d => d.morfeuszWords.forEach(word => {
        if (!wordMap[word]) {
            wordMap[word] = 0;
        }
        wordMap[word]++;
    }))

    const wyniki = Object.keys(wordMap).map(key => { return {
        label: key,
        value: wordMap[key]
    }});

    wyniki.sort((o1, o2) => o1.value > o2.value ? -1 : 1);
    console.log(wyniki);
}

const callMorfeuszRequest = (data: Array<object>, queue: Array<object>) => {
    const value = data.pop();
    if (value) {
        analyzeMorfeusz(value)
            .then(result => {
                queue.push(result);
                console.log(`Processed: ${queue.length}, Left: ${data.length}`);
                setTimeout(() => callMorfeuszRequest(data, queue), 1000);
            })
    } else {
        console.log(queue.length);
        new FileTools().saveToJSON(JSON.stringify(queue), path.join('src', 'data', 'trueWithMorfeuszAndSentiment.json'));
    }
};

const analyzeMorfeusz = (data: object): Promise<object> =>  {
    return new Promise<object>(resolve => {
        new MorfeuszRequest().tagFromMorfeusz(data['text'].replace(/\n/g, ''))
            .then(result => {
                data['morfeuszWords'] = new MorfeuszRequest().filterMorfeuszValues(result).map(morfeusz => morfeusz.coreValue.split(':')[0]);
                resolve(data);
            });
    });
}