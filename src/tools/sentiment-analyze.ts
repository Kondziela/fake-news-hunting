import * as Sentiment from 'sentiment-polish';

export class SentimentAnalyze {

    public getSentimentPolish(text: string): number {
        return new Sentiment(text).score;
    }

}