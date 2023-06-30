import React from "react";
import "../styles/DropdownMenu.scss";
import store from "../redux/store";
import AuthService from "../services/Auth";
import * as HomeActions from "../redux/actions/home";

export default class DropdownMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPlaylists: false
        }
    }

    logout() {
        AuthService.logout().then((response) => {
          if(response.data.success) {
            window.location = "/client/auth";
          }
        })
      }
    
    render() {
        return (
            <div ref={ this.props.innerRef } class="popup">
                <button className="button popup-trigger" onClick={ () => store.dispatch(HomeActions.changeOpenMenu(true)) }>Menu</button>

                { this.props.open &&
                    <div id="app-home-menu">
                        <ul id="menu">
                            { this.props.userLogged && 
                                <div className="menu-item">
                                    <li><a onClick={ () => this.setState({ showPlaylists: !this.state.showPlaylists })}>Minhas playlists</a></li>

                                    { this.state.showPlaylists && 
                                        <ul id="submenu">
                                            { this.props.playlists.map((p) => {
                                                return (
                                                    <div key={ `playlist-${p.id}` } class="menu-item">
                                                        <li>
                                                            <a onClick={ () => {
                                                                window.location = `/client/home?playlist=${p.id}`;
                                                            }
                                                            }>{ p.name }</a>
                                                        </li>
                                                    </div>
                                                );
                                            }) }

                                            <button className="menu-item" id="new-playlist" type="button" onClick={  () => { store.dispatch(HomeActions.changeOpenMenu(false)); this.props.openPopup(); } }>
                                                Nova
                                            </button>
                                        </ul>
                                    }
                                </div>
                            }
                            <div className="menu-item">
                                <li>Sobre</li>
                            </div>
                            <div className="menu-item" onClick={ () => this.logout() }>
                                <li>Sair</li>
                            </div>
                        </ul>
                    </div>
                }
            </div>
        )
    }
}