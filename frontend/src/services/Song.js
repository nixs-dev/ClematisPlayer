import axios from "axios";


export default class SongService {
    static insertSong(playlist, song, progressCallback=null) {
        let url = `/api/playlist/${playlist}/add`;
        let formData = new FormData();

        formData.append("song", song);

        return axios.post(url, formData, {
            onUploadProgress: (event) => progressCallback ? progressCallback(Math.round(event.loaded/event.total) * 100) : null
        });
    }
}