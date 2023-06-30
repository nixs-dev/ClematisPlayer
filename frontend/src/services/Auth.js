import axios from "axios";


export default class AuthService {
    static persistSession() {
        return axios.get(`/api/auth`, {
            withCredentials: true
        });
    }

    static logout() {
        return axios.delete("/api/logout", {
            withCredentials: true
        });
    }
}