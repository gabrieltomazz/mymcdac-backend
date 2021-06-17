import { google } from 'googleapis';

require('dotenv').config();

const googleConfig = {
    clientId: process.env.CLIENTID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: process.env.CLIENTSECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: process.env.REDIRECT, // this must match your google api settings
};

/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

class GoogleUtil {
    constructor() {
        this.auth = this.createConnection(); // this is from previous step
    }

    /**
     * Create the google auth object which gives us access to talk to google's apis.
     */
    createConnection() {
        return new google.auth.OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirect,
        );
    }

    /**
     * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
     */
    getConnectionUrl(auth) {
        return auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
            scope: defaultScope,
        });
    }

    /**
     * Create the google url to be sent to the client.
     */
    urlGoogle() {
        const url = this.getConnectionUrl(this.auth);
        return url;
    }

    /**
     * Helper function to get the library with access to the google plus api.
     */
    getGooglePlusApi(auth) {
        return google.plus({ version: 'v1', auth });
    }

    /**
     * Extract the email and id of the google account from the "code" parameter.
     */
    async getGoogleAccountFromCode(code) {
        // get the auth "tokens" from the request
        const data = await this.auth.getToken(code);
        const { tokens } = data;

        // add the tokens to the google api so we have access to the account
        const auth = this.createConnection();
        auth.setCredentials(tokens);

        // connect to google plus - need this to get the user's email
        const people = google.people('v1');
        const me = await people.people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses,names',
            auth,
        });

        // get the google id and email
        const userGoogleId = me.data.names[0].metadata.source.id; // 102209983350328580649
        const userGoogleEmail = me.data.emailAddresses && me.data.emailAddresses.length && me.data.emailAddresses[0].value;
        const userName = me.data.names && me.data.names.length && me.data.names[0].displayName;

        // return so we can login or sign up the user
        return {
            provider_id: userGoogleId,
            userEmail: userGoogleEmail,
            userName,
        };
    }
}

export default new GoogleUtil();
