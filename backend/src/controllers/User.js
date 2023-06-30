import UserModel from "../models/User.js";
import Auth from "../utils/Auth.js";
import bcrypt from "bcrypt";


export default class UserController {
    static signUp(request, response) {
        UserModel.create({
            username: request.body.username,
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, 10)
        }).then(() => {
            response.json({
                success: true,
                content: null
            })
        }).catch((error) => {
            response.json({
                success: false,
                content: error
            })
        }) 
    }

    static login(request, response) {
        console.log(request.body.remember);
        
        if(request.body.email === undefined || request.body.password === undefined) {
            response.json({
                success: false,
                content: "Campos inválidos!"
            });
            
            return;
        }

        UserModel.findOne({
            where: {
                email: request.body.email
            }
        }).then((found) => {
            if(found) {
                if(bcrypt.compareSync(request.body.password, found.password)) {
                    Auth.getNewAccessToken(found.getPublicAttributes(), response, request.body.remember).then((tokens) => {
                        if(tokens) {
                            response.json({
                                success: true,
                                content: null
                            });
                        }
                        else {
                            response.json({
                                success: false,
                                content: "Falha ao gerar token de acesso!"
                            });
                        }
                    });
                }
                else {
                    response.json({
                        success: false,
                        content: "Senha incorreta"
                    });
                }
            }
            else {
                response.json({
                    success: false,
                    content: "Usuário não cadastrado"
                });
            }
        }).catch((error) => {
            console.log(error);
            response.json({
                success: false,
                content: error
            })
        })
    }
}