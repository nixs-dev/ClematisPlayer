import SongModel from "../models/Song.js";
import PlaylistModel from "../models/Playlist.js";


export default class PlaylistController {
    static create(request, response) {
        PlaylistModel.createPlaylist({
            userId: request.user.id,
            name: request.body.name,
            description: request.body.description,
            cover: request.file ? request.file.buffer : null
        }).then(() => {
            response.json({
                success: true,
                content: null
            });
        }).catch((error) => {
            response.json({
                success: false,
                content: error
            });
        })
    }

    static update(request, response) {
        let playlistID = request.params.playlist;

        PlaylistModel.get(playlistID).then((found) => {
            if(found) {
                if(request.file) found.cover = request.file.buffer;

                for(let key in request.body) {
                    found[key] = request.body[key];
                }

                found.save().then(() => {
                    response.json({
                        success: true,
                        content: null
                    })
                }).catch((error) => {
                    response.json({
                        success: false,
                        content: error.message
                    })
                })
            }
            else {
                response.json({
                    success: false,
                    content: "Playlist não encontrada!"
                })
            }
        })
    }

    static search(request, response) {
        PlaylistModel.search(`%${ request.query.search }%`).then((playlists) => {
            response.json({
                success: true,
                content: playlists
            })
        }).catch((error) => {
            response.json({
                success: false,
                content: error
            })
        })
    }

    static getPlaylists(request, response) {
        PlaylistModel.getAll({ where: { userId: request.user.id }}).then((playlists) => {
            response.json({
                success: true,
                content: playlists
            });
        }).catch((error) => {
            response.json({
                success: false,
                content: error
            });
        })
    }

    static deletePlaylist(request, response) {
        PlaylistModel.get(request.params.playlist).then((playlist) => {
            playlist.delete().then(() => {
                response.json({
                    success: true,
                    content: null
                })
            }).catch((error) => {
                response.json({
                    success: false,
                    content: error
                })
            })
        }).catch((error) => {
            response.json({
                success: false,
                content: error
            })
        })
    }

    static getContent(request, response) {
        let content = {
            playlist: null,
            songs: null
        }

        PlaylistModel.get(request.params.playlist).then((playlist) => {
            if(!playlist) {
                response.json({
                    success: false,
                    content: "Playlist não encontrada!"
                });
                return;
            }
            content.playlist = playlist;

            SongModel.getByPlaylist(request.params.playlist).then((songs) => {
                content.songs = songs;

                response.json({
                    success: true,
                    content: content
                });
            }).catch((error) => {
                response.json({
                    success: false,
                    content: error
                });
            })
        }).catch((error) => {
            response.json({
                success: false,
                content: error
            });
        });
    }
}