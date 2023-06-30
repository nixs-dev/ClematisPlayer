import Cookies from 'js-cookie';


var INITIAL_STATE = {
    playlistNotFound: false,
    loading: false,
    playlist: null,
    playlists: [],
    songs: [],
    currentSong: {
        index: null,
        playing: false,
        duration: 0,
        durationReadable: "00:00",
        time: 0,
        timeReadable: "00:00"
    },
    playlistMode: {
        selected: "NORMAL",
        modes: [
            "NORMAL",
            "LOOP"
        ]
    },
    songMode: {
        selected: "NORMAL",
        modes: [
            "NORMAL",
            "LOOP"
        ]
    },
    playerVolume: 100,
    menuDropdownOpen: false,
    playlistEditorOpen: false,
    searchComponentOpen: false
}

const Home = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case "PLAYLIST_NOT_FOUND":
            return {
                ...state,
                playlistNotFound: action.payload
            }
        case "CHANGE_PLAYER_VOLUME":
            return {
                ...state,
                playerVolume: action.payload
            }
        case "CHANGE_LOADING":
            return {
                ...state,
                loading: action.payload
            }
        case "CHANGE_PLAYING":
            return {
                ...state,
                currentSong: { ...state.currentSong, playing: action.payload }
            }
        case "CHANGE_SONG_MODE":
            let currentSongModeIndex = state.songMode.modes.indexOf(state.songMode.selected);
            
            return {
                ...state,
                songMode: { selected: state.songMode.modes[currentSongModeIndex + 1 > state.songMode.modes.length - 1 ? 0 : currentSongModeIndex + 1], modes: [...state.songMode.modes ]}
            }
        case "CHANGE_PLAYLIST_MODE":
            let currentPlaylistModeIndex = state.playlistMode.modes.indexOf(state.playlistMode.selected);
            
            return {
                ...state,
                playlistMode: { selected: state.playlistMode.modes[currentPlaylistModeIndex + 1 > state.playlistMode.modes.length - 1 ? 0 : currentPlaylistModeIndex + 1], modes: [...state.playlistMode.modes ]}
            }
        case "SET_PLAYLIST":
            return {
                ...state,
                playlist: action.payload
            }
        case "SET_PLAYLIST_SONGS":
            return {
                ...state,
                songs: action.payload
            }
        case "SET_SONG_DURATION":
            return {
                ...state,
                currentSong: { ...state.currentSong, duration: action.payload.raw, durationReadable: action.payload.readable }
            }
        case "SET_SONG_TIME":
            return {
                ...state,
                currentSong: { ...state.currentSong, time: action.payload.raw, timeReadable: action.payload.readable }
            }
        case "SET_PLAYLISTS":
            return {
                ...state,
                playlists: action.payload
            }
        case "INIT_SONG_DATA":
            let found = state.songs.map((s) => s.id).indexOf(action.payload);
            let newSong = {
                ...INITIAL_STATE.currentSong,
                index: found
            }

            return {
                ...state,
                currentSong: newSong
            }
        case "CHANGE_OPEN_SEARCH":
            return {
                ...state,
                searchComponentOpen: action.payload
            }
        case "CHANGE_OPEN_PLAYLIST_EDITOR":
            return {
                ...state,
                playlistEditorOpen: action.payload
            }
        case "CHANGE_OPEN_MENU":
            return {
                ...state,
                menuDropdownOpen: action.payload
            }
        default:
            return state;
    }
}

export default Home;