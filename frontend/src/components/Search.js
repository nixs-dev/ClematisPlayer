import React from "react";
import defaultPlaylistCover from "../images/default_playlist_cover.png";
import "../styles/Search.scss";
import { Buffer } from "buffer";


export default class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            results: []
        }
    }
    
    handleSearch(promise) {
        promise.then((result) => {
            this.setState({ results: result.data.content });
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <div ref={ this.props.innerRef } className={ this.props.open ? "search-component active" : "search-component inactive" }>
                <div className="search-input">
                    <input type="text" placeholder="Explorar" onFocus={ () => this.props.changeOpen(true) } onChange={ (event) => event.target.value ? this.handleSearch(this.props.search(event.target.value)) : this.props.changeOpen(false) } />
                    <span><i className="fa-solid fa-magnifying-glass"></i></span>
                </div>
                { this.state.results.length > 0 &&
                    <div className="search-results-list">
                        { this.state.results.map((result) => 
                            <div className="search-result" onClick={ () => window.location = `/client/home?playlist=${ result.id }`}>
                                <img src={ result.cover ? `data:image/png;base64, ${Buffer.from(result.cover.data).toString("base64")}` : defaultPlaylistCover }/>
                                <div>
                                    <label className="result-playlist-name">{ result.name }</label>

                                    <div className="result-playlist-info">
                                        <p className="result-playlist-description">{ result.description }</p>
                                        <label className="result-playlist-author">Criado por { result.user.username }</label>
                                    </div>
                                </div>
                            </div>
                        ) }
                    </div>
                }
            </div>
        );
    }
}