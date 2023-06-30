import axios from "axios";


export default class PlaylistService {
    static getPlaylistContent(playlist, progressCallback=null) {
        return axios.get(`/api/playlist/${playlist}`, {
            withCredentials: true,
            onDownloadProgress: (event) => progressCallback ? progressCallback(Math.round(event.loaded/event.total) * 100) : null
        });
    }

    static createPlaylist(playlistData, progressCallback=null) {
        let formData = new FormData();
        for(let i in playlistData) formData.append(i, playlistData[i]);

        return axios.post("/api/create", formData, {
            withCredentials: true,
            onUploadProgress: (event) => progressCallback ? progressCallback(Math.round(event.loaded/event.total) * 100) : null
        });
    }

    static updatePlaylist(id, playlistChanges, progressCallback=null) {
        let formData = new FormData();
        for(let i in playlistChanges) formData.append(i, playlistChanges[i]);

        return axios.patch(`/api/playlist/${id}/update`, formData, {
            withCredentials: true,
            onUploadProgress: (event) => progressCallback ? progressCallback(Math.round(event.loaded/event.total) * 100) : null
        });
    }

    static deletePlaylist(playlistID, progressCallback=null) {
        return axios.delete(`/api/playlist/${playlistID}/delete`, {
            withCredentials: true,
            onUploadProgress: (event) => progressCallback ? progressCallback(Math.round(event.loaded/event.total) * 100) : null
        })
    }

    static getPlaylists(progressCallback=null) {
        return axios.get(`/api/playlist`, {
            withCredentials: true,
            onDownloadProgress: (event) => progressCallback ? progressCallback(Math.round(event.loaded/event.total) * 100) : null
        });
    }

    static search(playlist, progressCallback=null) {
        return axios.get(`/api/search?search=${playlist}`, {
            withCredentials: true,
            onDownloadProgress: (event) => progressCallback ? progressCallback(Math.round(event.loaded/event.total) * 100) : null
        })
    }
}