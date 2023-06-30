import SongModel from "../models/Song.js";


export default class SongController {
    static getSongs(request, response) {
        let playlist = request.params.playlist;
        
        SongModel.getByPlaylist(playlist).then((songs) => {
            response.json({
                success: true,
                content: songs
            })
        }).catch((error) => {
            response.json({
                success: false,
                content: error
            })
        });
    }

    static download(request, response) {
        let id = request.query.id;

        SongModel.findOne({
            where: {
                id: id
            }
        }).then((found) => {
            response.download("./public" + found.path);
        }).catch((error) => {
            console.log(error);
        })
    }

    static add(request, response) {
        let playlist = request.params.playlist;
        let song = request.file;

        if(song) {
            SongModel.saveToPlaylist(playlist, song).then(() => {
                response.json({
                    success: true,
                    content: null
                });
            }).catch((error) => {
                response.json({
                    success: false,
                    content: error
                });
            });
        }
        else {
            response.json({
                success: false,
                content: "Arquivo não enviado!"
            });
        }
    }
}