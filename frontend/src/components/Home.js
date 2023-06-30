import "../styles/Home.scss";
import React from "react";
import { Buffer } from "buffer";
import defaultAlbumCover from "../images/disk.png";
import appName from "../images/app_name.png";
import defaultPlaylistCover from "../images/default_playlist_cover.png";
import butterfly from "../images/butterfly.png";
import DataFormat from "../utils/DataFormat";
import PlaylistService from "../services/Playlist";
import AuthService from "../services/Auth";
import SongService from "../services/Song";
import DropdownMenu from "../components/DropdownMenu";
import LoadingPopup from "../components/LoadingPopup";
import PlaylistEditor from "./PlaylistEditor";
import Search from "./Search";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import { connect } from "react-redux";
import store from "../redux/store";
import * as HomeActions from "../redux/actions/home";


class Home extends React.Component {
  constructor(props) {
    super(props);
  
    this.song = null;
    this.userLogged = null;
    this.inputSong = React.createRef();
    this.timeBar = React.createRef();
    this.loadingBar = React.createRef();
    this.playlistEditor = React.createRef();
    this.searchComponent = React.createRef();
    this.dropdownMenu = React.createRef();
  }
  
  setAudioTime(time) {
    this.song.currentTime = time;
  }

  setAudioVolume(volume) {
    store.dispatch(HomeActions.changeVolume(volume));
    this.song.volume = volume / 100;
  }

  changePlaylistMode() {
    store.dispatch(HomeActions.changePlaylistMode())
  }

  changeSongMode() {
    store.dispatch(HomeActions.changeSongMode());
  }

  setAudio(id, path) {
    let itWasPlaying = this.props.currentSong.playing;

    if(itWasPlaying) {
      // stop old song

      this.play();
    }

    this.song = new Audio(window.location.origin + path);
    store.dispatch(HomeActions.initSong(id));

    this.song.onloadeddata = () => {
      if(itWasPlaying) {
        // play new song

        this.play();
      }

      this.song.volume = this.props.playerVolume / 100;
    }

    this.song.ondurationchange = () => {
      store.dispatch(HomeActions.setDuration(this.song.duration));
    }

    this.song.ontimeupdate = () => {
      store.dispatch(HomeActions.setTime(this.song.currentTime));
    }

    this.song.onplaying = () => {
      store.dispatch(HomeActions.changePlaying(true));
    }

    this.song.onpause = () => {
      /*
        Audio automatically pauses when is finished, but because that, 'playing' state gets false, as if the song wasn't being playing. So, it wasn't possible the handler try change 'playing' state when song has got finished.
      */

      if(this.song.currentTime < this.song.duration) {
        store.dispatch(HomeActions.changePlaying(false));
      }
    }

    this.song.onended = () => {
      if(this.props.songMode.selected === "NORMAL") {
        if(this.props.currentSong.index === this.props.songs.length - 1) {
          if(this.props.playlistMode.selected === "NORMAL") {
            store.dispatch(HomeActions.changePlaying(false));
          }
          else {
            this.skip();
          }
        }
        else {
          this.skip();
        }
      }
      else if(this.props.songMode.selected === "LOOP") {
        this.song.currentTime = 0;

        this.song.play();
      }
    }
  }

  play() {
    this.props.currentSong.playing ? this.song.pause() : this.song.play();
  }

  skip(next=true) {
    let song;

    if(next) {
      song = this.props.songs[(this.props.currentSong.index === this.props.songs.length - 1 ? 0 : this.props.currentSong.index + 1)];
    }
    else {
      song = this.props.songs[(this.props.currentSong.index === 0 ? this.props.songs.length - 1 : this.props.currentSong.index - 1)];
    }

    this.setAudio(song.id, song.path);
  }

  addSongs(files) {
    store.dispatch(HomeActions.changeLoading(true));
    
    this.loadingBar.current.newLoading(`Enviando "${ files[0].name }"...`, (loadCallback) => SongService.insertSong(this.props.playlist.id, files[0], loadCallback)).then((response) => {
      this.getServerData();
    });
  }

  downloadSong() {
    let songID = this.props.songs[this.props.currentSong.index].id;

    window.location = `/api/song/download?id=${songID}`;
  }

  openPlaylistEditor(data=null) {
    this.playlistEditor.current.config(data ? true : false, data);

    store.dispatch(HomeActions.changeOpenEditor(true));
  }

  getServerData() {
    let params = new URLSearchParams(window.location.search);

    if(params.get("playlist")) {
      store.dispatch(HomeActions.changeLoading(true));

      this.loadingBar.current.newLoading(`Carregando playlist...`, (loadCallback) => PlaylistService.getPlaylistContent(params.get("playlist"), loadCallback)).then((response) => {
        if(response.data.success && response.data.content.playlist) {
          store.dispatch(HomeActions.setPlaylist(response.data.content.playlist));
          store.dispatch(HomeActions.setSongs(response.data.content.songs));
          store.dispatch(HomeActions.setPlaylistNotFound(false));

          localStorage.setItem("lastPlaylist", params.get("playlist"));
        }
        else {
          store.dispatch(HomeActions.setPlaylistNotFound(true));
        }
      });
    }
    else {
      if(localStorage.getItem("lastPlaylist")) {
        window.location = `/client/home?playlist=${localStorage.getItem("lastPlaylist")}`;
      }
      else {
        store.dispatch(HomeActions.setPlaylistNotFound(true));
      }
    }

    if(this.userLogged) {
      this.loadingBar.current.newLoading(`Carregando playlists...`, (loadCallback) => PlaylistService.getPlaylists(loadCallback)).then((response) => {
        store.dispatch(HomeActions.setPlaylists(response.data.content));
      });
    }
  }

  deletePlaylist() {
    PlaylistService.deletePlaylist(this.props.playlist.id).then((response) => {
      if(response.data.success) {
        localStorage.removeItem("lastPlaylist");

        window.location.reload();
      }
      else {
        console.log(response.data.content);
      }
    })
  }

  componentDidMount() {
    this.userLogged = Cookies.get("USERID") ? parseInt(Cookies.get("USERID"))  : null;

    if(Cookies.get("REFRESHJWTTOKEN")) {
      AuthService.persistSession().then((response) => {
        if(response.data.success) {
          this.getServerData();
        }
        else {
        }
      });
    }

    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  handleClickOutside = (event) => {
    if(!this.searchComponent.current.contains(event.target)) {
      store.dispatch(HomeActions.changeOpenSearch(false));
    }

    if(!this.dropdownMenu.current.contains(event.target)) {
      store.dispatch(HomeActions.changeOpenMenu(false));
    }
  }

  render() {
    return (
      <div id="app-home">
        <div className="not-render">
          <input type="file" ref={ this.inputSong } accept="audio/*" multiple={ true } onChange={ (event) => this.addSongs(event.target.files) }/>
        </div>
        <div id="app-home-header">
          <img id="app-logo" src={ appName } alt="icon"/>

          <Search innerRef={ this.searchComponent } open={ this.props.searchComponentOpen } changeOpen={ (open) => store.dispatch(HomeActions.changeOpenSearch(open)) } search={ (playlist) => PlaylistService.search(playlist) }/>

          { this.userLogged
            ? <DropdownMenu innerRef={ this.dropdownMenu } open={ this.props.menuDropdownOpen } playlists={ this.props.playlists } userLogged={ this.userLogged } openPopup={ () => this.openPlaylistEditor() }/>
            : <a href="/client/auth">Login</a>
          }
        </div>
        <div id="app-home-body">
          { this.props.playlist &&
            <div id="player">
              <div id="player-frame">
                <div id="player-header">
                  <Popup trigger={
                    <button className={ `button-player small ${ this.props.currentSong.index !== null ? "" : "disabled" }` }>
                      <i className="fa-solid fa-gear"></i>
                    </button>
                  }>
                    <div id="song-options">
                      <ul>
                        <li><button onClick={ () => this.downloadSong() }>Download</button></li>
                        <li><button onClick={ null }>Denunciar</button></li>
                      </ul>
                    </div>
                  </Popup>
                  
                </div>
                <div id="album-cover">
                  { this.props.currentSong.index !== null && this.props.songs[this.props.currentSong.index].cover ? <img className="static-cover" alt="Capa" src={ "data:image/png;base64," + Buffer.from(this.props.songs[this.props.currentSong.index].cover.data ? this.props.songs[this.props.currentSong.index].cover.data : this.props.songs[this.props.currentSong.index].cover).toString("base64") }/> : <img className={ this.props.currentSong.playing ? "spin" : null } alt="Capa" src={defaultAlbumCover}/> }
                </div>

                <div id="song-info">
                  <label id="song-name">{ this.props.currentSong.index !== null ? this.props.songs[this.props.currentSong.index].name : "Desconhecido"}</label>
                  <label id="album-name">{ this.props.currentSong.index !== null ? this.props.songs[this.props.currentSong.index].album : "Desconhecido"}</label>
                </div>

                <div id="song-progress">
                  <input ref={ this.timeBar } type="range" max={ this.props.currentSong.duration } value={ this.props.currentSong.index === null ? 0 : this.props.currentSong.time } onChange={ (event) => this.setAudioTime(event.target.value) }/>

                  <div id="song-duration">
                    <label id="song-time">{ this.props.currentSong.timeReadable }</label>
                    /
                    <label id="song-limit">{ this.props.currentSong.durationReadable }</label>
                  </div>
                </div>

                <div id="song-utils" className={ this.props.currentSong.index !== null ? null : "disabled"}>
                  <div id="basic-controllers">
                    <button className={ this.props.playlistMode.selected === "NORMAL" ? "button-player small" : "button-player small active" } onClick={ () => this.changePlaylistMode() }><i className="fa-solid fa-arrows-spin"></i></button>
                    <button className="button-player"><i className="fa-solid fa-backward-fast" onClick={ () => this.skip(false) }></i></button>
                    <button className="button-player" onClick={ () => this.play() }>{ this.props.currentSong.playing ? <i className="fa-solid fa-circle-pause"></i> : <i className="fa-solid fa-circle-play"></i> }</button>
                    <button className="button-player"><i className="fa-solid fa-forward-fast" onClick={ () => this.skip() }></i></button>
                    <button className={ this.props.songMode.selected === "NORMAL" ? "button-player small" : "button-player small active" } onClick={ () => this.changeSongMode() }><i className="fa-solid fa-repeat"></i></button>
                  </div>
                  <div id="song-volume">
                    <button className="button-player small" onClick={ () => this.props.playerVolume > 0 ? this.setAudioVolume(0) : this.setAudioVolume(100) }><i className={ this.props.playerVolume > 0 ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark" }></i></button>
                    <input type="range" min={ 0 } max={ 100 } value={ this.props.playerVolume } onChange={ (event) => this.setAudioVolume(event.target.value) }/>
                  </div>
                </div>
              </div>
            </div>
        }

        { this.props.playlist &&
          <div id="playlist">
            <div id="playlist-info">
              <div id="playlist-cover">
                <img src={ this.props.playlist && this.props.playlist.cover ? `data:image/png;base64, ${Buffer.from(this.props.playlist.cover.data ? this.props.playlist.cover.data : this.props.playlist.cover).toString("base64")}` : defaultPlaylistCover } alt="Capa"/>
              </div>
              <div id="playlist-literal-info">
                <label id="playlist-name">{ this.props.playlist ? this.props.playlist.name : null }</label>
                <p id="playlist-description">{ this.props.playlist ? this.props.playlist.description : null }</p>

                { this.userLogged === this.props.playlist.user.id && 
                  <div id="playlist-options">
                    <button onClick={ () => this.deletePlaylist() }><i className="fa-solid fa-trash"></i></button>
                    <button onClick={ () => this.openPlaylistEditor(store.getState().Home.playlist) }><i className="fa-solid fa-pen-to-square"></i></button>
                    <button onClick={ () => this.inputSong.current.click() }><i className="fa-solid fa-plus"></i></button>
                  </div>
                }
              </div>
            </div>
            <div id="songs-list">
              { this.props.songs && this.props.songs.map((s) => {
                  return (
                    <div key={ `song-${s.id}` } className="song" onClick={ () => this.setAudio(s.id, s.path) }>
                      <img className="song-album-cover" src={ s.cover ? "data:image/png;base64," + Buffer.from(s.cover.data ? s.cover.data : s.cover).toString("base64") : defaultAlbumCover }/>
                      <label className="song-title">{ s.name }</label>
                      { this.props.currentSong.index !== null && this.props.songs[this.props.currentSong.index].id === s.id && this.props.currentSong.playing ? <i className="fa-solid fa-music"></i> : null }
                    </div>
                  );
                })
              }
            </div>
            <div id="playlist-footer">
              <label id="playlist-author">{ this.props.playlist ? this.props.playlist.user.username : "DESCONHECIDO" }</label>
              <label id="playlist-update-datetime">{ this.props.playlist ? DataFormat.dateToString(new Date(this.props.playlist.updatedAt)) : null }</label>
            </div>
          </div>
        }

        { this.props.playlistNotFound &&
          <div id="playlist-not-found">
            <img src={ butterfly } alt="butterfly"/>
            <div>
              <p>
                Essa playlist não pode ser identificada ou se encontra restrita!
              </p>
              <p>
                Por que não criar para você aquilo ao qual deseja? Devem haver outras pessoas procurando o mesmo.
              </p>
            </div>
            <button className="primary-button" onClick={ () => store.dispatch(HomeActions.changeOpenEditor(true)) }>Criar</button>
          </div>
        }

        <PlaylistEditor ref={ this.playlistEditor } open={ this.props.playlistEditorOpen } close={ () => store.dispatch(HomeActions.changeOpenEditor(false)) }/>
        <LoadingPopup ref={ this.loadingBar } open={ this.props.loading } close={ () => store.dispatch(HomeActions.changeLoading(false)) } />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  ...store.Home
});

export default connect(mapStateToProps)(Home);