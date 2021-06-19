import * as queryString from 'query-string';
import axios from 'axios';

require('dotenv').config();

// Create URL to Authenticate User
const stringifiedParams = queryString.stringify({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.FACEBOOK_REDIRECT,
    scope: ['email', 'public_profile'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
});

const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

class FacebookUtil {
    /**
     * Create the facebook url to be sent to the client.
     */
    urlFacebook() {
        return facebookLoginUrl;
    }

    /**
     * Get Token from Facebook
     */
    async getAccessTokenFromCode(code) {
        const { data } = await axios({
            url: 'https://graph.facebook.com/v4.0/oauth/access_token',
            method: 'get',
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                redirect_uri: process.env.FACEBOOK_REDIRECT,
                code,
            },
        });
        return data.access_token;
    }

    /**
     * Extract the email and id of the Facebook account from the "access_token" parameter.
     */
    async getFacebookUserData(access_token) {
        const {
            data,
        } = await axios({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
                fields: ['id', 'email', 'first_name', 'last_name'].join(','),
                access_token,
            },
        });

        const {
            id, email, first_name, last_name,
        } = data;

        return {
            provider_id: id,
            userEmail: email,
            userName: `${first_name} ${last_name}`,
        };
    }
}
export default new FacebookUtil();
