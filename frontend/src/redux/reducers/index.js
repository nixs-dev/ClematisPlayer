import { combineReducers } from "redux";
import AuthReducer from "./auth.js";
import HomeReducer from "./home.js";


export default combineReducers({
    Auth: AuthReducer,
    Home: HomeReducer
});