import UserModel from "../models/User.js";
import Auth from "../utils/Auth.js";


export default class AuthMiddleware {
    static mustBeLogged(request, response, next) {
        let LOGGED_USER_DATA = Auth.validateRefreshToken(request.cookies.REFRESHJWTTOKEN);

        if(LOGGED_USER_DATA) {
            let TOKEN_DATA = Auth.validateAcessToken(request.cookies.JWTTOKEN);

            Auth.checkRefreshTokenReuse(request.cookies.REFRESHJWTTOKEN).then((result) => {
                if(result.reuse && !result.old) {
                    response.clearCookie("JWTTOKEN");
                    response.clearCookie("USERID");
                    response.clearCookie("REFRESHJWTTOKEN");
                    response.status(403);
                    response.json({
                        auth_error: true
                    });
                    response.end();

                    return;
                }
                else {
                    if(TOKEN_DATA) {
                        request.user = TOKEN_DATA;

                        next();
                    }
                    else {
                        AuthMiddleware.generateNewAcessToken(request, response, LOGGED_USER_DATA, !result.old).then((tokens) => {
                            request.cookies.JWTTOKEN = tokens.JWTTOKEN;
                            request.cookies.REFRESHJWTTOKEN = tokens.REFRESHJWTTOKEN;
                            request.user = Auth.validateAcessToken(tokens.JWTTOKEN);

                            next();
                        })
                    }
                }
            })
        }
        else {
            response.status(403);
            response.json({
                auth_error: true // MEANS THE REQUEST CANNOT BE FINISHED BECAUSE THE USER IS NOT AUTHENTICATED
            });
            response.end();
        }
    }

    static async generateNewAcessToken(request, response, LOGGED_USER_DATA, updateRT=true) {
        return UserModel.findOne({
            where: {
                id: LOGGED_USER_DATA.user
            }
        }).then(async (found) => {
            if(found) {
                return await Auth.getNewAccessToken(found.getPublicAttributes(), response, LOGGED_USER_DATA.rememberMe, updateRT).then((result) => {
                    if(result) {
                        return result;
                    }
                    else {
                        return false;
                    }
                });
            }
            else {
                console.log("ERRO");
                return false;
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    static mustNotLogged(request, response, next) {
        if(Auth.validateRefreshToken(request.cookies.REFRESHJWTTOKEN)) {
            response.json({
                "no_auth": true // MEANS THE REQUEST CANNOT BE FINISHED BECAUSE THE USER IS AUTHENTICATED
            })
        }
        else {
            next();
        }
    }
 }