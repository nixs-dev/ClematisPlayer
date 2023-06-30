import RefreshTokenModel from "../models/RefreshToken.js";
import Auth from "../utils/Auth.js";

export default class AuthController {
    static persistSession(request, response) {
        let REFRESH_TOKEN_DATA = Auth.validateRefreshToken(request.cookies.REFRESHJWTTOKEN);
        let ACCESS_TOKEN_DATA = Auth.validateAcessToken(request.cookies.JWTTOKEN);

        REFRESH_TOKEN_DATA && ACCESS_TOKEN_DATA ? response.json({ success: true, content: null }) : response.json({ success: false, content: `Sessão inválida, pois:\n\n RT: ${ REFRESH_TOKEN_DATA }\nAT: ${ ACCESS_TOKEN_DATA }  }` }); 
    }

    static logout(request, response) {
        RefreshTokenModel.destroy({
            where: {
                userID: request.cookies.USERID 
            }
        });

        response.clearCookie("USERID");
        response.clearCookie("JWTTOKEN");
        response.clearCookie("REFRESHJWTTOKEN");

        response.json({ success: true, content: null });
    }
}