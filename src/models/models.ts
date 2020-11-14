import {TwitterModel} from "./TwitterModel";

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
    title: string;
    text: string;
    url: string;
    id: string;
    domain: string;
    twitterId?: string;
    twitterDetails: TwitterModel
}