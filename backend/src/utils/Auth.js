import jswebtoken from "jsonwebtoken";
import RefreshTokenModel from "../models/RefreshToken.js";


export default class Auth {
    static #privateKey = "Clemat009is";
    static #refreshPrivateKey = "P1ay0r";
    static tokenExpiration = 300000; // five minutes
    static refreshTokenExpiration = 7 * 24 * 3600 * 1000 // One week


    static async getNewAccessToken(userData, response, rememberCredentials=false, updateRT=true) {
        const generateRT = () => {
            refreshToken = jswebtoken.sign({ user: userData.id, rememberMe: rememberCredentials }, this.#refreshPrivateKey, { expiresIn: Auth.refreshTokenExpiration });
            response.cookie("REFRESHJWTTOKEN", refreshToken, { domain: "127.0.0.1", sameSite: true, httpOnly: false, maxAge: rememberCredentials ? Auth.refreshTokenExpiration : null }); // One month
        };
        let storedRefreshToken = await RefreshTokenModel.findOne({
            where: {
                userID: userData.id
            }
        });

        let refreshToken = null;
        let accessToken = jswebtoken.sign(userData, this.#privateKey, { expiresIn: this.tokenExpiration });

        response.cookie("USERID", userData.id, { domain: "127.0.0.1", sameSite: true, httpOnly: false, maxAge: rememberCredentials ? Auth.tokenExpiration : null });
        response.cookie("JWTTOKEN", accessToken, { domain: "127.0.0.1", sameSite: true, httpOnly: false, maxAge: rememberCredentials ? Auth.tokenExpiration : null });

        if(storedRefreshToken) {
            if(updateRT) {
                generateRT();

                storedRefreshToken.old_refresh_token = storedRefreshToken.refresh_token;
                storedRefreshToken.old_refresh_token_expiration = new Date(Date.now() + (1000 * 60 * 1)); // one minute
                storedRefreshToken.refresh_token = refreshToken;
                storedRefreshToken.refresh_token_expiration = new Date(Date.now() + this.refreshTokenExpiration);

                await storedRefreshToken.save();
            }
        }
        else {
            generateRT();

            await RefreshTokenModel.create({
                userID: userData.id,
                refresh_token: refreshToken,
                refresh_token_expiration: new Date(Date.now() + this.refreshTokenExpiration)
            });
        }

        return { JWTTOKEN: accessToken, REFRESHJWTTOKEN: (refreshToken ? refreshToken : null) };
    }

    static validateAcessToken(accessToken) {
        try {
            return jswebtoken.verify(accessToken, this.#privateKey);
        }
        catch(error) {
            return null;
        }
    }

    static validateRefreshToken(refreshToken) {
        try {
            return jswebtoken.verify(refreshToken, this.#refreshPrivateKey);
        }
        catch(error) {
            return null;
        }
    }

    static async checkRefreshTokenReuse(refreshToken) {
        let tokenData = this.validateRefreshToken(refreshToken);
        let foundRT = await RefreshTokenModel.findOne({ where: { userID: tokenData.user } });
        let deleteRT = async (RT) => await RT.destroy();

        if(foundRT) {
            if(foundRT.dataValues.refresh_token === refreshToken) {
                return {
                    reuse: false,
                    old: false
                };
            }
            else if (foundRT.dataValues.old_refresh_token === refreshToken) {
                return {
                    reuse: true,
                    old: true
                }
            }
            else {
                console.log("REUSO DE TOKEN DETECTADO");
                await deleteRT(foundRT);

                return {
                    reuse: true,
                    old: false
                };
            }
        }

        return {
            reuse: true,
            old: false
        };
    }
}