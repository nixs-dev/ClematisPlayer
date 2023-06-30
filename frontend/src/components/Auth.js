import React from "react";
import UserService from "../services/User";
import "../styles/Auth.scss";
import authHeaderRepr from "../images/auth_header.png";
import logo from "../images/logo.png";
import appName from "../images/app_name.png";
import FormValidation from "../utils/FormValidation";
import store from "../redux/store";
import { connect} from "react-redux";
import * as AuthActions from "../redux/actions/auth";


class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.loginValidation = new FormValidation({
            email: {
                maxHeight: 3
            },
            password: {
                minHeight: 8
            }
        });
        this.loginResponse = React.createRef();
    }

    login() {
        UserService.login(this.props.userLogin).then((response) => {
            if(response.data.success) {
                store.dispatch(AuthActions.toLoginForm(true));
                window.location = "/client/home";
            }
            else {
                this.loginResponse.current.innerText = response.data.content;
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    loginFormChanges(fieldName, value) {
        let payload = {};
        payload[fieldName] = value;

        store.dispatch(AuthActions.setLoginData(payload));
        this.loginValidation.change(fieldName, value);
    }

    signUp() {
        UserService.signUp(this.props.userSignUp).then((response) => {
            if(response.data.success) {
                store.dispatch(AuthActions.toLoginForm(true));
                this.setSignUpData({});
            }
            else {
                console.log(response.data.content);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        document.title = "Sign";
    }

    render() {
        return (
            <div id="app-auth">
                <div id="app-auth-header">
                    <img src={ appName } alt="logo"/>
                    <div id="app-auth-header-options">
                        <div className="header-option">
                            <label>Colaborar</label>
                        </div>
                        <div className="header-option">
                            <label>Documentação</label>
                        </div>
                        <div className="header-option">
                            <label>Sobre</label>
                        </div>
                    </div>
                </div>
                <div id="app-auth-body">
                    <div id="greetings">
                        <img src={ logo } alt="logo"/>
                        <label>Bem vindo(a)</label>
                        <p>Comece já a compartilhar suas melhores faixas com o mundo!</p>
                    </div>
                    <div id="auth-container">
                        <div id="auth-container-header">
                            <img src={ authHeaderRepr } alt="repr"/>
                            <div id="forms-options">
                                <button type="button" className={ this.props.loginForm ? "active" : null } onClick={ () => store.dispatch(AuthActions.toLoginForm(true)) }>Entrar</button>
                                <button type="button" className={ this.props.loginForm ? null : "active" } onClick={ () => store.dispatch(AuthActions.toLoginForm(false)) }>Cadastrar</button>
                            </div>
                        </div>
                        <div id="auth-container-body">
                            { this.props.loginForm && 
                                <div id="login-auth">
                                    <div className="user-data">
                                        <div className="input-wrapper">
                                            <input placeholder="Email" type="text" onChange={ (event) => this.loginFormChanges("email", event.target.value) } required/>
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                        <div className="input-wrapper">
                                            <input placeholder="Senha" type="password" onChange={ (event) => this.loginFormChanges("password", event.target.value) } required/>
                                            <i className="fa-solid fa-lock"></i>
                                        </div>
                                    </div>

                                    <div id="login-response">
                                        <label ref={ this.loginResponse }></label>
                                    </div>
                                    
                                    <div id="login-actions">
                                        <div id="remember-me">
                                            <input type="checkbox" id="remember-me-checkbox" onChange={ (event) => store.dispatch(AuthActions.setLoginData({ remember: event.target.value }))}/>
                                            <label for="remember-me-checkbox">Lembrar de mim</label>
                                        </div>
                                        
                                        <a href="/">Esqueci minha senha</a>
                                    </div>

                                    <button type="button" className="primary-button" onClick={ () => this.login() }>Entrar</button>

                                    <div id="registration-invite">
                                        <label>Não tem uma conta?</label>
                                        <a onClick={ () => store.dispatch(AuthActions.toLoginForm(false)) }>Registre-se.</a>
                                    </div>
                                </div>
                            }
                            { !this.props.loginForm && 
                                <div id="signup-auth">
                                    <div className="user-data">
                                        <div className="input-wrapper">
                                            <input placeholder="Nome" type="text" onChange={ (event) => store.dispatch(AuthActions.setSignUpData({ username: event.target.value })) } required/>
                                            <i class="fa-solid fa-user"></i>
                                        </div>
                                        <div className="input-wrapper">
                                            <input placeholder="Email" type="email" onChange={ (event) => store.dispatch(AuthActions.setSignUpData({ email: event.target.value })) } required/>
                                            <i className="fa-solid fa-envelope"></i>
                                        </div>
                                        <div className="input-wrapper">
                                            <input placeholder="Senha" type="password" onChange={ (event) => store.dispatch(AuthActions.setSignUpData({ password: event.target.value })) } required/>
                                            <i className="fa-solid fa-lock"></i>
                                        </div>
                                    </div>

                                    <button type="button" className="primary-button" onClick={ () => this.signUp() }>Entrar</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div id="app-auth-footer">
                    <div id="central-info">
                        <div id="social-networks">
                            <a className="circular-button" href="https://www.instagram.com/nixsside/"><i className="fa-brands fa-instagram"></i></a>
                            <a className="circular-button" href="#"><i className="fa-brands fa-discord"></i></a>
                            <a className="circular-button" href="https://github.com/nixs-dev/"><i className="fa-brands fa-github"></i></a>
                        </div>
                        <div id="policy-options">
                            <a href="#">Termos de uso</a>
                            <span>.</span>
                            <a href="#">Política de privacidade</a>
                        </div>
                        <div id="creator-info">
                            &copy; 2023 Joabe Wick
                        </div>
                    </div>
                    <button id="creator-recommendation-button" className="circular-button">
                        <i className="fa-solid fa-ghost"></i>
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (store) => ({
    ...store.Auth
});

export default connect(mapStateToProps)(Auth);