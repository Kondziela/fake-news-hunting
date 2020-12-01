import {Conf} from "../Conf";
import * as Twitter from "twitter";
import {TwitterModel} from "../models/TwitterModel";

export class TwitterRequest {

    private loginDetails = {
        consumer_key: Conf.TWITTER_CONSUMER_KEY,
        consumer_secret: Conf.TWITTER_CONSUMER_SECRET,
        access_token_key: Conf.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: Conf.TWITTER_ACCESS_TOKEN_SECRET
    };
    private twitter: Twitter;

    constructor() {
        this.twitter = new Twitter(this.loginDetails);
    }

    public getDetailsOfTweet(tweetId: string): Promise<TwitterModel> {
        return new Promise<TwitterModel>(resolve => {
            this.twitter.get(`statuses/show/${tweetId}`, {tweet_mode: 'extended'}, (error, data, response) => {
                // @ts-ignore
                resolve(data);
            })
        });
    }

}