import {Facebook, FacebookApiException} from 'fb';
import {Conf} from "../Conf";

export class FacebookRequest {

    private fb: Facebook;
    private config: object = {
        version: 'v9.0',
        appId: Conf.FACEBOOK_APP_ID,
        appSecret: Conf.FACEBOOK_SECRET
    };

    constructor() {
        this.fb = new Facebook(this.config);
    }

    public readFacebookDetails() {
        this.fb.api(
            "/3426386547448411/feed",
            function (response) {
                if (response && !response.error) {
                    console.log(response);
                } else {
                    console.log(response.error);
                }
            }
        );
    }

}