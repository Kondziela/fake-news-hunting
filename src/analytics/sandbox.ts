import {FileTools} from "../tools/file-tools";
import {FakeNewsModel} from "../models/models";
import {FakeHunterRequest} from "../requests/fake-hunter.request";
import {workerData} from "worker_threads";

const wordMap = {};

new FileTools().readFile('src/data/originalDataFromFakeNewsHunter.json', (data: Array<FakeNewsModel>) => {
    data.forEach(d => {
       const domain = d.url.split('/')[2];
       if (!wordMap[domain]) {
           wordMap[domain] = 0;
       }
       wordMap[domain]++;
    });

    console.log(Object.keys(wordMap).map(key => { return {
        domain: key,
        number: wordMap[key]
    }}).sort((o1, o2) => o1.number > o2.number ? -1 : 1));
});

// new FileTools().readFile('src/data/fakeWithMorfeuszAndSentiment.json', (buffer: Buffer) => {
//     const data: Array<FakeNewsModel> = JSON.parse(new String(buffer).toString());
//
// });


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