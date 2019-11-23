## Eidolon

[![GitHub version](https://badge.fury.io/gh/abrisene%2Feidolon-server-ts.svg)](https://badge.fury.io/gh/abrisene%2Feidolon-server-ts)

An opinionated Express Server Boilerplate with Scaffolding for the following features:

**Database**
  - Redis
  - MongoDB / Mongoose
  - Neo4J

**Routing & Communication**
  - Routing (Express)
  - Websockets (Socket.io)
  - Rendering (Pug)

**Messaging**
  - PubSub (PubNub & Ably)
  - Email (Mailgun)
  - SMS & Telephony (Twilio)

**Storefront**
  - Payments (Stripe)

**Spreadsheets**
  - Airtable

## Installation & Usage

Eidolon requires a .env for configuration. As of the current version, the following configs are required to ensure complete functionality:

```
npm install
touch .env
```

If you wish to use any of the following features, you 
- [MongoDB](https://cloud.mongodb.com/) with Replica Set (For User Credentials and Transactions)
- [Mailgun](https://www.mailgun.com) (For Email Validation & Password Reset)
- [Facebook App](https://developers.facebook.com/apps/) (For Facebook Login)
- [Google App](https://console.cloud.google.com/cloud-resource-manager) (For Google Login)

### Run

To run the server with the settings in the config, run:

```
npm run start
```

### API

Eidolon can be used as a configurable module which exposes configs, constants, models and other internal modules.

```javascript
const eidolon = require('../lib');
const { config, constants, models, mail } = eidolon;

/**
 # Main
 */

const main = async () => {
  try {
    await eidolon.init();
  } catch(err) {
    console.error(err);
  }
};

main();
```

### Environment Variables

Eidolon looks for the environment variables below in an .env file in the app's root directory. Defaults are provided where possible.

#### Basics

```
APP_NAME          // A String, displayed in Emails.
PORT              // Port for the http Server, Passed to Express.
HTTPS             // Defines whether or not https should be used - SHOULD BE SET FALSE UNTIL HTTPS SUPPORT IS ADDED.

```

#### Urls

```
HOSTNAME          // The hostname of the server. This will default to 'localhost:<PORT>' if not defined.
SERVER_URL        // The URL of the server. This will override the effects of setting the hostname - only one or the other should be used.
CLIENT_URL        // The URL of the client, used for CORS and for emails.
CORS_URLS         // An array of additional URLS which should be enabled for CORS. Will enable CORS universally if set to '*'
LOGO_URL          // The URL of the app's logo. This will be used in emails sent to users.

```

#### Databases

```
MONGODB_URL       // A URL to a mongoDB database.
PROD_MONGODB      // A URL to a mongoDB database. This value is populated by Heroku's Mongo Lab addon.

REDIS_URL         // A URL to a redis instance. This value is populated by Heroku's Redis addon.
REDISCLOUD_URL    // A URL to a redis instance. This value is populated by Heroku's Redis Cloud addon.

NEO4J {           // A JSON object containing Neo4J credentials.
  "url"           // Url of the Neo4J instance.
  "username"      // Database username.
  "password"      // Database password.
}

```
#### Authentication

```
JWT_SECRET        // JWT Secret. **THIS SHOULD NOT BE SHARED EVER**
JWT_ISSUER        // Optional Issuer property for JWT. Defaults to hostname.
JWT_AUDIENCE      // Optional Audience property for JWT. Defaults to hostname.

GOOGLE_AUTH {
  "clientID"      // Your app id.
  "clientSecret"  // Your app's secret key.
  "callbackURL"   // Optional callback URL. This will default to <HOSTNAME>/auth/google/redirect
}

FACEBOOK_AUTH {
  "clientID"      // Your app id.
  "clientSecret"  // Your app's secret key.
  "callbackURL"   // Optional callback URL. This will default to <HOSTNAME>/auth/facebook/redirect
}

TWITTER_AUTH {}   // Not yet supported.

LINKEDIN_AUTH {}  // Not yet supported.

PINTEREST_AUTH {} // Not yet supported.

```

#### PubSub

```
PUBNUB {          // A JSON object containing PubNub credentials.
  "publishKey"    // PubNub publish key
  "subscribeKey"  // PubNub subscribe key
  "secretKey"     // Optional Secret Key
}

ABLY {            // A JSON object containing Ably credentials
  "secretKey"     // The Ably API key to use on the server
  "publicKey"     // The Ably API key to use on the client
}

```

#### Messaging

```
MAILGUN {         // A JSON object containing Mailgun credentials. Authentication relies on this.
  "secretKey"     // The Mailgun API key.
  "publicKey"     // An optional Public Key
  "domain"        // The Domain mail will be sent from.
}

TWILIO {          // An optional JSON object containing Twilio credentials.
  "account"       // The Twilio account ID.
  "secretKey"     // The Twilio account's key.
}

```

#### Payments

```
STRIPE {          // An optional JSON object containing Stripe credentials.
  "secretKey"     // The account's Secret Key.
  "publicKey"     // The account's Public Key.
}

```

#### Spreadsheets

```
AIRTABLE {
  "secretKey"     // Secret key for an Airtable Base.
}

```
