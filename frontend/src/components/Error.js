import React from "react";
import Cookies from "js-cookie";
import "../styles/Error.scss";
import AuthService from "../services/Auth";


export default class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(Cookies.get("REFRESHJWTTOKEN")) {
            AuthService.persistSession();
        }
    }

    render() {
        return (
            <div id="app-error">
                <div id="app-error-header">
                    
                </div>

                <div id="app-error-body">
                    <div id="center-information">
                        <span>404</span>

                        <a href="/" className="primary-button">Voltar ao início</a>
                    </div>
                </div>
            </div>
        )
    }
}