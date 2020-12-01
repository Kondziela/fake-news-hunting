import {Entities2, TwitterModel} from "./TwitterModel";

export interface FakeHunterResponse {
    "total": number;
    "current_page": number;
    "page_size": number;
    "results": Array<{
        "date": Date;
        "domains": Array<{
            "created_at": Date;
            "id": string;
            "name": string;
        }>
        "expert_opinion": {
            "title": string,
            "confirmation_sources": string;
            "comment": string;
            "date": Date;
            "verdict": boolean;
        },
        "fact_checker_opinions": Array<any>;
        "id": string;
        "is_pinned": boolean;
        "reported_at": Date;
        "screenshot_url": string;
        "tags": Array<{
            "created_at": Date;
            "id": string;
            "name": string;
        }>
        "text": string;
        "title": string;
        "url": string;
        "verdict": boolean;
        "verified_by_expert": boolean;
    }>
}

export class FakeNewsModel {
    verdict: boolean;
    // data from FakeHunter
    title: string;
    url: string;
    id: string;
    domain: string;
    // text analyze
    morfeuszWords?: Array<string>;
    sentiment?: number;
    // twitter data and analyze
    twitterId?: string;
    twitterAnalyze: TwitterAnalyze;
    twitterDetails: TwitterModel;
}

export class TwitterAnalyze {
    twittStats: {
        text: string;
        twittLength: number;
        geo?: any;
        coordinates?: any;
        place?: any;
        is_quote_status: boolean;
        retweet_count: number;
        favorite_count: number;
        favorited: boolean;
        retweeted: boolean;
        possibly_sensitive: boolean;
        possibly_sensitive_appealable: boolean;
        lang: string;
    };
    entitiesStats: {
        hashtags: any[];
        hashtagsCount: number;
        symbolsCount: number;
        user_mentions: string[][];
        userMentionsCount: number;
        urlsCount: number;
        mediaCount: number;
    };
    userStats: {
        name: string;
        location: string;
        description: string;
        protected: boolean;
        followers_count: number;
        friends_count: number;
        listed_count: number;
        created_at: string;
        favourites_count: number;
        utc_offset?: any;
        time_zone?: any;
        geo_enabled: boolean;
        verified: boolean;
        statuses_count: number;
        lang?: any;
        contributors_enabled: boolean;
        is_translator: boolean;
        is_translation_enabled: boolean;
        has_extended_profile: boolean;
        default_profile: boolean;
        following: boolean;
        follow_request_sent: boolean;
        notifications: boolean;
        translator_type: string;
    };
}

export class MorfeuszResponse {
    originalValue: string;
    coreValue: string;
    type: string;
}