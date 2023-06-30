import axios from "axios";

export default class UserService {
    static login(user) {
        return axios.post("/api/login", user, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    static signUp(user) {
        return axios.post("/api/signup", user, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}