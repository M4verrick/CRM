import { CognitoUser } from 'amazon-cognito-identity-js';
import Pool from "./UserPool";

export class TokenManager {
    static async getTokens() {
        try {
            const session = await new Promise((resolve, reject) => {
                const user = Pool.getCurrentUser();
                if (!user) {
                    reject(new Error('No current user'));
                    return;
                }

                user.getSession((err, session) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(session);
                });
            });

            return {
                idToken: session.getIdToken().getJwtToken(),
                accessToken: session.getAccessToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
                expiration: session.getAccessToken().getExpiration() * 1000, // Convert to milliseconds
                issued: session.getAccessToken().getIssuedAt() * 1000, // Convert to milliseconds
            };
        } catch (error) {
            console.error('Error getting tokens:', error);
            throw error;
        }
    }

    static async refreshTokens() {
        try {
            const user = Pool.getCurrentUser();
            if (!user) {
                throw new Error('No current user');
            }

            return new Promise((resolve, reject) => {
                user.refreshSession(user.getSignInUserSession().getRefreshToken(), (err, session) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        idToken: session.getIdToken().getJwtToken(),
                        accessToken: session.getAccessToken().getJwtToken(),
                        expiration: session.getAccessToken().getExpiration() * 1000,
                    });
                });
            });
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            throw error;
        }
    }

    static isTokenExpired(expiration, buffer = 300000) { // 5 minute buffer by default
        return Date.now() + buffer >= expiration;
    }

    static async getValidAccessToken() {
        try {
            const tokens = await this.getTokens();
            
            if (this.isTokenExpired(tokens.expiration)) {
                const refreshedTokens = await this.refreshTokens();
                return refreshedTokens.accessToken;
            }
            
            return tokens.accessToken;
        } catch (error) {
            console.error('Error getting valid access token:', error);
            throw error;
        }
    }
}