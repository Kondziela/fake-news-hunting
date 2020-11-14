export interface Entities {
    hashtags: any[];
    symbols: any[];
    user_mentions: string[][];
    urls: string[][];
    media: string[][];
}

export interface ExtendedEntities {
    media: string[][];
}

export interface Entities2 {
    description: string[];
}

export interface User {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    description: string;
    url?: any;
    entities: Entities2;
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
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: boolean;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    has_extended_profile: boolean;
    default_profile: boolean;
    default_profile_image: boolean;
    following: boolean;
    follow_request_sent: boolean;
    notifications: boolean;
    translator_type: string;
}

export interface QuotedStatusPermalink {
    url: string;
    expanded: string;
    display: string;
}

export interface Entities3 {
    hashtags: any[];
    symbols: any[];
    user_mentions: any[];
    urls: string[];
}

export interface User2 {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    description: string;
    url: string;
    entities: string[];
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
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: boolean;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_banner_url: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    has_extended_profile: boolean;
    default_profile: boolean;
    default_profile_image: boolean;
    following: boolean;
    follow_request_sent: boolean;
    notifications: boolean;
    translator_type: string;
}

export interface QuotedStatusPermalink2 {
    url: string;
    expanded: string;
    display: string;
}

export interface QuotedStatus {
    created_at: string;
    id: number;
    id_str: string;
    full_text: string;
    truncated: boolean;
    display_text_range: number[];
    entities: Entities3;
    source: string;
    in_reply_to_status_id?: any;
    in_reply_to_status_id_str?: any;
    in_reply_to_user_id?: any;
    in_reply_to_user_id_str?: any;
    in_reply_to_screen_name?: any;
    user: User2;
    geo?: any;
    coordinates?: any;
    place?: any;
    contributors?: any;
    is_quote_status: boolean;
    quoted_status_id: number;
    quoted_status_id_str: string;
    quoted_status_permalink: QuotedStatusPermalink2;
    retweet_count: number;
    favorite_count: number;
    favorited: boolean;
    retweeted: boolean;
    possibly_sensitive: boolean;
    possibly_sensitive_appealable: boolean;
    lang: string;
}

export interface TwitterModel {
    created_at: string;
    id: number;
    id_str: string;
    full_text: string;
    truncated: boolean;
    display_text_range: number[];
    entities: Entities;
    extended_entities: ExtendedEntities;
    source: string;
    in_reply_to_status_id?: any;
    in_reply_to_status_id_str?: any;
    in_reply_to_user_id?: any;
    in_reply_to_user_id_str?: any;
    in_reply_to_screen_name?: any;
    user: User;
    geo?: any;
    coordinates?: any;
    place?: any;
    contributors?: any;
    is_quote_status: boolean;
    quoted_status_id: number;
    quoted_status_id_str: string;
    quoted_status_permalink: QuotedStatusPermalink;
    quoted_status: QuotedStatus;
    retweet_count: number;
    favorite_count: number;
    favorited: boolean;
    retweeted: boolean;
    possibly_sensitive: boolean;
    possibly_sensitive_appealable: boolean;
    lang: string;
}


