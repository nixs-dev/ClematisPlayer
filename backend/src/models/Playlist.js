import db from "../../db.js";
import fs from "fs";
import SongModel from "./Song.js";
import UserModel from "./User.js";
import { Model, Op, DataTypes } from "sequelize";


class PlaylistModel extends Model {

    async delete() {
        return new Promise(async (resolve, reject) => {
            let t = await db.transaction();

            this.destroy({ transaction: t }).then(() => {
                fs.rm(`./public/storage/playlists/${this.id}`, { recursive: true }, (error) => {
                    if(!error) {
                        t.commit().then(() => {
                            resolve();
                        });
                    }
                    else {
                        t.rollback().then(() => {
                            reject(error);
                        });
                    }
                })
            }).catch((error) => {
                reject(error);
            })
        });
    }

    static get(playlistID) {
        return this.findOne({
            where: {
                id: playlistID
            },
            include: UserModel
        });
    }

    static getAll() {
        return this.findAll({
            include: UserModel
        });
    }

    static async createPlaylist(playlistData) {
        return new Promise((resolve, reject) => {
            this.create(playlistData).then((createdPlaylist) => {
                fs.mkdirSync(`./public/storage/playlists/${createdPlaylist.id}`);
                resolve();
            }).catch((error) => {
                reject(error);
            })       
        });
    }

    static search(query) {
        return this.findAll({
            where: {
                name: { [Op.like]: query}
            },
            include: UserModel
        })
    }
}


PlaylistModel.init({
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    cover: {
        type: DataTypes.BLOB("long")
    }
}, {
    modelName: "playlist",
    sequelize: db
});

// RELATIONSHIP

PlaylistModel.hasMany(SongModel, {
    foreignKey: {
        allowNull: false
    },
    onDelete: "CASCADE"
});
SongModel.belongsTo(PlaylistModel);

UserModel.hasMany(PlaylistModel, {
    foreignKey: {
        allowNull: false
    },
    onDelete: "CASCADE"
});
PlaylistModel.belongsTo(UserModel);

export default PlaylistModel;