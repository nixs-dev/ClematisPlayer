import db from "../../db.js";
import UserModel from "./User.js";
import { Model, DataTypes } from "sequelize";


class RefreshTokenModel extends Model {
}

RefreshTokenModel.init({
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token_expiration: {
        type: DataTypes.DATE,
        allowNull: false
    },
    old_refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    old_refresh_token_expiration: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
{
    sequelize: db,
    modelName: "refreshtoken"
});

UserModel.hasOne(RefreshTokenModel, {
    foreignKey: {
        allowNull: false,
        name: "userID"
    },
    onDelete: "CASCADE"
});
RefreshTokenModel.belongsTo(UserModel, {
    foreignKey: {
        allowNull: false,
        name: "userID"
    },
    onDelete: "CASCADE"
});


export default RefreshTokenModel;