import { Model, DataTypes } from "sequelize";
import db from "../../db.js";


class UserModel extends Model {
    static PUBLIC_ATTRIBUTES = ["id", "username", "email"];

    getPublicAttributes() {
        let jsonObj = this.toJSON();
        let copy = { ...jsonObj };

        for(let key in jsonObj) {
            if(!(UserModel.PUBLIC_ATTRIBUTES.includes(key))) {
                delete copy[key];
            }
        }

        return copy;
    }
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        unique: true,
        type: DataTypes.STRING(15),
        allowNull: false
    },
    email: {
        unique: true,
        type: DataTypes.STRING(80),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "user"
});

export default UserModel;