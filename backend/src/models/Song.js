import fs from "fs";
import db from "../../db.js";
import jsmediatags from "jsmediatags";
import { Model, DataTypes } from "sequelize";


class SongModel extends Model {
    static getByPlaylist(playlist) {
        return this.findAll({
            where: {
                playlistId: playlist
            }
        });
    }

    static async saveToPlaylist(playlistID, file) {
        let newFilename = `${file.filename}.${file.originalname.split(".").at(-1)}`;
        let fileInfo = await this.readSongInfo(file.path);

        if(!fs.existsSync(`./public/storage/playlists/${playlistID}`)) {
            fs.mkdirSync(`./public/storage/playlists/${playlistID}`);
        }

        fs.renameSync(file.path, `./public/storage/playlists/${playlistID}/${newFilename}`, (error) => {
            if (error) throw error;
        });

        let song = {
            name: fileInfo.tags.title,
            path: `/storage/playlists/${playlistID}/${newFilename}`,
            cover: Buffer.from(fileInfo.tags.picture.data),
            album: fileInfo.tags.album,
            author: fileInfo.tags.artist,
            playlistId: playlistID
        };

        return this.create(song);
    }

    static readSongInfo(songPath) {
        return new Promise((resolve, reject) => {
            jsmediatags.read(songPath, {
                onSuccess: (data) => {
                    resolve(data);
                },
                onError: (error) => {
                    reject(error)
                }
            });
        });
    }
}

SongModel.init({
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cover: {
        type: DataTypes.BLOB("long")
    },
    album: {
        type: DataTypes.STRING
    },
    author: {
        type: DataTypes.STRING
    }
}, {
    modelName: "song",
    sequelize: db
});

export default SongModel;