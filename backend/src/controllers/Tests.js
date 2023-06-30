import UserModel from "../models/User.js";
import jsonwebtoken from "jsonwebtoken";
import Auth from "../utils/Auth.js";

export default class TestsController {
    static createUser(request, response) {
        let userData = {
            username: "Teste",
            email: "test@oasosao.com",
            password: "123"
        };

        UserModel.create(userData).then(() => {
            response.send("Pronto");

            let RT = jsonwebtoken.sign({ user: userData.id, rememberMe: true }, "P1ay0r", { expiresIn: "1M" });
            let AT = jsonwebtoken.sign(userData, "P1ay0r", { expiresIn: "1M" });

            response.json({
                RT: RT,
                AT: AT
            });
        });
    }

    static getUser(request, response) {
        UserModel.findOne({
            where: {
                username: "Teste"
            }
        }).then((found) => {
            response.send(found.getPublicAttributes());
        })
    }
}