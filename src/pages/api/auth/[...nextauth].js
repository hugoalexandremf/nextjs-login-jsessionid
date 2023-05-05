import NextAuth from 'next-auth';
import axios from 'axios';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'authorizationserver',
      name: 'AuthorizationServer',
      type: 'oauth',
      wellKnown: process.env.AUTHORIZATIONSERVER_URL + '/.well-known/openid-configuration',
      clientId: process.env.AUTHORIZATIONSERVER_ID,
      clientSecret: process.env.AUTHORIZATIONSERVER_SECRET,
      /* params: {
        grant_type: 'authorization_code',
        redirect_uri:
          'http://127.0.0.1:3000/api/auth/callback/authorizationserver',
      }, */
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/authorizationserver',
          // scope: 'openid secureapi',
          scope: 'secureapi',
        },
      },
      callbackUrl: 'http://localhost:3000/',
      token: {
        async request(context) {
          console.log('tokenrequest:', context);
          const body = {
            grant_type: 'authorization_code',
            redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/authorizationserver',
            client_id: process.env.AUTHORIZATIONSERVER_ID,
            client_secret: process.env.AUTHORIZATIONSERVER_SECRET,
            code: context.params.code || 'undefined',
          };
          const data = new URLSearchParams(body).toString();

          console.log('before calling token endpoint:', process.env.AUTHORIZATIONSERVER_URL);

          try {
            const tokenEndpointResponse = await axios({
              url: process.env.AUTHORIZATIONSERVER_URL + '/oauth2/token',
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              data,
            });

            console.log('token endpoint response:', tokenEndpointResponse);

            return { tokens: tokenEndpointResponse.data };
          } catch (err) {
            console.error(err);
            throw new Error(err);
          }
        },
      },
      /*userinfo: {
        url: process.env.AUTHORIZATIONSERVER_URL + '/oauth2/introspect',
        params: { scope: 'openid' },
        async request(context) {
          console.log('userInfo request:', context.tokens);
          const r = await axios({
            method: 'GET',
            url: process.env.AUTHORIZATIONSERVER_URL + '/oauth2/introspect',
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          });
          return r.data;
        },
      },*/
      userinfo: {
        url: process.env.AUTHORIZATIONSERVER_URL + '/oauth2/introspect',
        params: { scope: 'openid' },
        async request(context) {
          console.log('context.tokens:', context.tokens);

          const body = {
            token: '${context.tokens.access_token}',
            client_id: process.env.AUTHORIZATIONSERVER_ID,
            client_secret: process.env.AUTHORIZATIONSERVER_SECRET,
          };
          //const data = new URLSearchParams(body).toString();

          try {
            const introspectionEndpointResponse = await axios({
              url: process.env.AUTHORIZATIONSERVER_URL + '/oauth2/introspect',
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              data: {
                token: context.tokens.access_token,
                client_id: process.env.AUTHORIZATIONSERVER_ID,
                client_secret: process.env.AUTHORIZATIONSERVER_SECRET,
              },
            });

            console.log('introspection endpoint response:', introspectionEndpointResponse.data);

            return introspectionEndpointResponse.data;
            /* const userInfo = {
              id: introspectionEndpointResponse.data.sub,
              name: introspectionEndpointResponse.data.sub,
              email: introspectionEndpointResponse.data.sub,
              profile: 'test',
            };

            return userInfo; */
          } catch (err) {
            console.error(err);
            throw new Error(err);
          }
        },
      },
      profile(profile) {
        console.log('profile:', profile);

        /* return {
          ...profile,
          // name: 'test',
          name: profile.sub,
          // id: 'test@test.test',
          id: profile.sub,
          // name: '${}'
        }; */

        return {
          id: profile.sub,
          name: profile.sub,
          email: profile.sub,
        };

        /* return {
          ...profile,
          name: `${profile.given_name} ${profile.family_name}`,
          id: profile.email,
        }; */
      },
    },
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // checks: ['pkce', 'state'],
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours

    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString('hex');
    },
  },
  // Enable debug messages in the console if you are having problems
  debug: true,
  /* callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('user', user, account, profile);
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
  }, */
};

export default NextAuth(authOptions);
