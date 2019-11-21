/*
 * auth.social.ts
 * Social Strategy for Passport
 */

/**
 * Module Dependencies
 */

import { IOAuth2StrategyOption, OAuth2Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth';
// import { Strategy as GoogleTokenStrategy } from 'passport-google-token';
import { Profile as FacebookProfile, Strategy as FacebookStrategy, StrategyOption } from 'passport-facebook';
// import * as FacebookTokenStrategy from 'passport-facebook-token';

import Configs from '../configs';
import { User } from '../models';

/**
 * Interfaces
 */

export interface ISocialProfile {
  id: string;
  email: string;
  emails: string[];
  displayName?: string;
  gender?: string;
  metadata?: object;
}

/**
 * Constants
 */

const G_CALLBACK_URL = '';
const FB_CALLBACK_URL = '';

/**
 * Returns mapped Options for the indicated social auth service from Configs.
 * @param service The key of the config used for the social service.
 */
function getOptions(service: string): StrategyOption|IOAuth2StrategyOption {
  const callbackURL = service === 'facebook' ? FB_CALLBACK_URL : G_CALLBACK_URL;
  const { clientID, clientSecret } = Configs.getConfig(service);
  const options = {
    clientID,
    clientSecret,
    callbackURL,
  };
  return options;
}

/**
 * Maps a Google Profile into the ISocialProfile Interface
 * @param profile A social profile passed from Google.
 */
function extractGoogleProfile(profile: GoogleProfile): ISocialProfile {
  const result = {
    id: profile.id,
    email: profile.emails[0].value,
    emails: profile.emails.map(e => e.value),
    displayName: profile.displayName,
    gender: profile.gender,
    metadata: {
      name: profile.name,
      photoUrl: profile.photos,
    },
  };
  return result;
}

/**
 * Maps a Facebook Profile into the ISocialProfile Interface
 * @param profile A social profile passed from Facebook.
 */
function extractFacebookProfile(profile: FacebookProfile): ISocialProfile {
  const result = {
    id: profile.id,
    email: profile.emails[0].value,
    emails: profile.emails.map(e => e.value),
    displayName: profile.displayName,
    gender: profile.gender,
    metadata: {
      name: profile.name,
      username: profile.username,
      profileUrl: profile.profileUrl,
    },
  };
  return result;
}

/**
 * Module Exports
 */

/**
 * Builds Google Passport Strategy for Middleware
 */
export async function authGoogle() {
  const options = getOptions('google');
  return new GoogleStrategy(options, async (accessToken, refreshToken, profile, done) => {
    const userData = extractGoogleProfile(profile);
    try {
      const result = await User.authenticateSocial('google', userData);
      return done(null, result.user);
    } catch (err) {
      return done(err, false);
    }
  });
}

/**
 * Builds Facebook Passport Strategy for Middleware
 */
export async function authFacebook() {
  const options = getOptions('facebook');
  return new FacebookStrategy(options, async (accessToken, refreshToken, profile, done) => {
    const userData = extractFacebookProfile(profile);
    try {
      const result = await User.authenticateSocial('facebook', userData);
      return done(null, result.user);
    } catch (err) {
      return done(err, false);
    }
  });
}
