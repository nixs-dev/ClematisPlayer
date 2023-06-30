import DataFormat from "../../utils/DataFormat";


export function initSong(id) {
    return {
        type: "INIT_SONG_DATA",
        payload: id
    }
}

export function changeLoading(bool) {
    return {
        type: "CHANGE_LOADING",
        payload: bool
    }
}

export function changeVolume(volume) {
    return {
        type: "CHANGE_PLAYER_VOLUME",
        payload: volume
    }
}

export function changePlaylistMode() {
    return {
        type: "CHANGE_PLAYLIST_MODE",
        payload: null
    }
}

export function changeSongMode() {
    return {
        type: "CHANGE_SONG_MODE",
        payload: null
    }
}

export function setDuration(duration) {
    return {
        type: "SET_SONG_DURATION",
        payload: {
            raw: duration,
            readable: DataFormat.secondsToShortTime(duration)
        }
    }
}

export function setTime(time) {
    return {
        type: "SET_SONG_TIME",
        payload: {
            raw: time,
            readable: DataFormat.secondsToShortTime(time)
        }
    }
}

export function changePlaying(bool) {
    return {
        type: "CHANGE_PLAYING",
        payload: bool
    }
}

export function changeOpenEditor(bool) {
    return {
        type: "CHANGE_OPEN_PLAYLIST_EDITOR",
        payload: bool
    }
}

export function changeOpenMenu(bool) {
    return {
        type: "CHANGE_OPEN_MENU",
        payload: bool
    }
}

export function changeOpenSearch(bool) {
    return {
        type: "CHANGE_OPEN_SEARCH",
        payload: bool
    }
}

export function setPlaylistNotFound(bool) {
    return {
        type: "PLAYLIST_NOT_FOUND",
        payload: bool
    }
}

export function setPlaylist(data) {
    return {
        type: "SET_PLAYLIST",
        payload: data
    }
}

export function setSongs(songs) {
    return {
        type: "SET_PLAYLIST_SONGS",
        payload: songs
    }
}

export function setPlaylists(playlists) {
    return {
        type: "SET_PLAYLISTS",
        payload: playlists
    }
}
