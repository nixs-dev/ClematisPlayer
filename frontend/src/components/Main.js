import React from "react";
import "../styles/Main.scss";
import appName from "../images/app_name.png";
import AuthService from "../services/Auth";
import Cookies from "js-cookie";


export default class Main extends React.Component {
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
            <div id="app-main">
                <div id="app-main-header">
                    <img id="app-logo" src={ appName }/>

                    <div id="app-main-header-options"> 
                        <div className="header-option">
                            <a>Colaborar</a>
                        </div>
                        <div className="header-option">
                            <a>Documentação</a>
                        </div>
                        <div className="header-option">
                            <a>Sobre</a>
                        </div>
                    </div>

                    <div id="contacts">
                        <a className="circular-button" href="https://www.instagram.com/nixsside/"><i className="fa-brands fa-instagram"></i></a>
                        <a className="circular-button" href="#"><i className="fa-brands fa-discord"></i></a>
                        <a className="circular-button" href="https://github.com/nixs-dev/"><i className="fa-brands fa-github"></i></a>
                    </div>
                </div>
                <div id="app-main-body">
                    <div className="section" id="welcome">
                        <div id="welcome-message">
                            <label id="pre-title">
                                Sua plataforma de compartilhamento e entretenimento musical
                            </label>
                            <label id="title">
                                Clematis
                            </label>
                            <p id="description">
                                Um serviço de reprodução e compartilhamento de músicas.
                                Nosso site conta com uma area de reprodução e outra de exploração de playlists.
                                O website se baseia em fazer upload de arquivos de audio locais para playlists criadas em nosso servidor e os tê-los
                                acessíveis online, permitindo o compartilhamento dos mesmos com toda a nossa rede de usuários ou apenas pessoas permitidas.
                            </p>
                            <div>
                                <a className="primary-button" href="/client/auth">Explorar</a>
                                <a className="secondary-button" href="#features">Saber mais</a>
                            </div>
                        </div>
                    </div>
                    <div className="section" id="features">

                        <div id="features-list">
                            <div className="feature-frame">
                                <i class="fa-solid fa-arrows-split-up-and-left"></i>
                                <p>Flexibilidade
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet libero vitae odio consectetur congue et a neque. Etiam faucibus rhoncus tellus, eget commodo.
                                </p>
                            </div>
                            <div className="feature-frame">
                                <i class="fa-solid fa-database"></i>
                                <p>Armazenamento ilimitado
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet libero vitae odio consectetur congue et a neque. Etiam faucibus rhoncus tellus, eget commodo.
                                </p>
                            </div>
                            <div className="feature-frame">
                                <i class="fa-solid fa-key"></i>
                                <p>Privacidade de conteúdo
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet libero vitae odio consectetur congue et a neque. Etiam faucibus rhoncus tellus, eget commodo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}