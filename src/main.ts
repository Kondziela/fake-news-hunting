import {FakeNewsModel, TwitterAnalyze} from "./models/models";
import * as path from "path";
import {FileTools} from "./tools/file-tools";
import {FakeHunterRequest} from "./requests/fake-hunter.request";
import {TwitterRequest} from "./requests/twitter.request";
import {MorfeuszRequest} from "./requests/morfeusz.request";
import {SentimentAnalyze} from "./tools/sentiment-analyze";
import {TwitterModel} from "./models/TwitterModel";

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

    public readDetailsForTwitterIdList(twitterIdList: Array<number>) {
        
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
            data.twitterAnalyze = this.addTwitterFields(data.twitterDetails);
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

    private addTwitterFields(twitterDetails: TwitterModel): TwitterAnalyze {
        const details = twitterDetails;
        return {
            twittStats: {
                text: details.full_text,
                twittLength: details.full_text.length,
                geo: details.geo,
                coordinates: details.coordinates,
                place: details.place,
                is_quote_status: details.is_quote_status,
                retweet_count: details.retweet_count,
                favorite_count: details.favorite_count,
                favorited: details.favorited,
                retweeted: details.retweeted,
                possibly_sensitive: details.possibly_sensitive,
                possibly_sensitive_appealable: details.possibly_sensitive_appealable,
                lang: details.lang
            },
            entitiesStats: {
                hashtags: details.entities.hashtags.map(h => h.text),
                hashtagsCount: details.entities.hashtags.length,
                symbolsCount: details.entities.symbols.length,
                user_mentions: details.entities.user_mentions.map(u => u['name']),
                userMentionsCount: details.entities.user_mentions.length,
                urlsCount: details.entities.urls.length,
                mediaCount: details.entities.media.length
            },
            userStats: {
                name: details.user.name,
                location: details.user.location,
                description: details.user.description,
                protected: details.user.protected,
                followers_count: details.user.followers_count,
                friends_count: details.user.friends_count,
                listed_count: details.user.listed_count,
                created_at: details.user.created_at,
                favourites_count: details.user.favourites_count,
                utc_offset: details.user.utc_offset,
                time_zone: details.user.time_zone,
                geo_enabled: details.user.geo_enabled,
                verified: details.user.verified,
                statuses_count: details.user.statuses_count,
                lang: details.user.lang,
                contributors_enabled: details.user.contributors_enabled,
                is_translator: details.user.is_translator,
                is_translation_enabled: details.user.is_translation_enabled,
                has_extended_profile: details.user.has_extended_profile,
                default_profile: details.user.default_profile,
                following: details.user.following,
                follow_request_sent: details.user.follow_request_sent,
                notifications: details.user.notifications,
                translator_type: details.user.translator_type
            }
        }
    }
}