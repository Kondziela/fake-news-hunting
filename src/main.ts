import { Request } from './request';
import {TwitterRequest} from "./twitterRequest";
import {Tools} from "./Tools";
import {FakeNewsModel} from "./models/models";

const tools = new Tools();
const twitter = new TwitterRequest();

new Request().downloadAllFakeHistory()
    .then(results => {
        console.log(`Downloaded ${results.length} records from Fake Hunter Page`);
        // tools.saveToCSV(results);
        // tools.saveToJSON(JSON.stringify(results));
        const twitterFakes = results.filter(result => result.domain.includes('twitter'));
        console.log(`Number of fakes related to Twitter: ${twitterFakes.length}`)
        Promise.all(twitterFakes.map(twitt => getTwittDetails(twitt)))
            .then(twitts => {
                console.log('Downloaded details from Twitter');
                tools.saveToJSON(JSON.stringify(twitts), 'fakeWithTwitts.json')
            })
    });

const getTwittDetails = (data: FakeNewsModel): Promise<object> => {
    return new Promise<object>(resolve => {
        twitter.getDetailsOfTweet(data.twitterId)
            .then(twitt => {
                data.twitterDetails = twitt;
                resolve(data);
            })
    });
}

// new TwitterRequest().getDetailsOfTweet('1326281517392420866');