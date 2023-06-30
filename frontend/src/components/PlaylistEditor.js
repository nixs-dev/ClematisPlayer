import React from "react";
import { Buffer } from "buffer";
import PlaylistService from "../services/Playlist";
import "../styles/PlaylistEditor.scss";
import defaultPlaylistCover from "../images/default_playlist_cover.png"
import * as HomeActions from "../redux/actions/home" ;
import store from "../redux/store";


class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.playlistCoverInput = React.createRef();
        this.oldPlaylistData = {};
        this.state = {
            update: false,
            updateID: null,
            playlistCoverPreview: null,
            playlistData: {
                cover: null,
                name: null,
                description: null
            }
        }
    }

    config(update=false, data=null) {
        this.setState({ update: update, playlistCoverPreview: data && data.cover ? "data:image/png;base64, " + Buffer.from(data.cover.data).toString("base64") : null });

        if(data) {
            this.oldPlaylistData = data;
            this.updateID = data.id;
            this.setState({ playlistData: data });
        }
        else {
            this.setState({ playlistData: {
                cover: null,
                name: null,
                description: null
            }});
        }
    }

    createPlaylist() {
        PlaylistService.createPlaylist(this.state.playlistData, null).then((response) => {
            this.props.close();
        }).catch((error) => {
            console.log(error);
        });
    }

    updatePlaylist() {
        let changes = {};

        for(let key in this.state.playlistData) {
            if(this.state.playlistData[key] !== this.oldPlaylistData[key]) {
                changes[key] = this.state.playlistData[key];
            }
        }

        PlaylistService.updatePlaylist(this.updateID, changes).then((response) => {
            if(response.data.success) {
                if(Object.keys(changes).includes("cover")) {
                    let fileReader = new FileReader();

                    fileReader.onload = () => {
                        this.setState({ playlistData: { ...this.state.playlistData, cover: Buffer.from(fileReader.result) } }, () => {
                            store.dispatch(HomeActions.setPlaylist(this.state.playlistData));
                            this.props.close();
                        });
                    }

                    fileReader.readAsArrayBuffer(this.state.playlistData.cover);
                }
                else {
                    store.dispatch(HomeActions.setPlaylist(this.state.playlistData));
                    this.props.close();
                }
            }
            else {
                alert(response.data.content);
            }
        });
    }

    showPlaylistCover() {
        if(this.playlistData.cover) {
            if(this.state.playlistData.cover instanceof File) {
                return 
            }
            else {
                return ;
            }
        }
        else {
            return defaultPlaylistCover;
        }
    }


    render() {
        if(this.props.open) {
            return (
                <div className="modal-overlay">
                    <div className="modal" id="new-playlist-modal">
                        <div className="modal-header">
                        </div>
                        <div className="modal-content">
                            <h2>{ this.state.update ? this.state.playlistData.name : "Nova Playlist" }</h2>
                            
                            <img src={ this.state.playlistCoverPreview ? this.state.playlistCoverPreview : defaultPlaylistCover } alt="Playlist cover" onClick={ () => this.playlistCoverInput.current.click() }/>

                            <div id="playlist-data">
                                <div className="playlist-info">
                                    <input ref={ this.playlistCoverInput } type="file" style={{ display: "hidden" }} onChange={ (event) => this.setState({ playlistData: {...this.state.playlistData, cover: event.target.files[0]}}, () => this.setState({ playlistCoverPreview: this.state.playlistData.cover ? URL.createObjectURL(this.state.playlistData.cover) : null }) ) }/>
                                </div>
                                <div className="playlist-info">
                                    <input type="text" value={ this.state.playlistData.name } placeholder="Nome" onChange={ (event) => this.setState({ playlistData: {...this.state.playlistData, name: event.target.value}}) }/>
                                </div>
                                <div className="playlist-info">
                                    <input type="text" value={ this.state.playlistData.description }  placeholder="Descrição" onChange={ (event) => this.setState({ playlistData: {...this.state.playlistData, description: event.target.value}}) }/>
                                </div>
                            </div>

                            <button type="button" className="primary-button" onClick={ () => this.state.update ? this.updatePlaylist() : this.createPlaylist() }>Salvar</button>
                        </div>
                        <div className="modal-footer">
                            <button className="primary-modal-button" onClick={ () => this.props.close() }>
                                <i class="fa-solid fa-xmark"></i>
                                <label>Fechar</label>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return null
        }
    }
}

export default Modal;