import { Sequelize } from "sequelize";
import fs from "fs";


const db = new Sequelize("mysql://dev:sandbox@127.0.0.1:3306/musicplayer", {
    logging: false,
    dialect: "mysql",
    timezone: '-03:00',
    dialectOptions: {
        multipleStatements: true
    }
});

db.query(fs.readFileSync("src/dbEvents.sql", {
    encoding: "utf-8"
}));

export default db;