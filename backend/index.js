import express from "express";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import fs from "fs";
import db from "./db.js";
import cookieParser from "cookie-parser";
import PlaylistController from "./src/controllers/Playlist.js";
import SongController from "./src/controllers/Song.js";
import UserController from "./src/controllers/User.js";
import AuthMiddleware from "./src/middlewares/Auth.js";
import AuthController from "./src/controllers/Auth.js";


const app = express();
const imgUploader = multer({ limits: { fieldSize: 10 * 1024 * 1024 }, storage: memoryStorage() });
const songsUploader = multer({ dest: "./tmp", limits: {  fieldSize: 10 * 1024 * 1024 } });


app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));
app.use(cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    exposedHeaders: ["Content-Length", "Transfer-Encoding"],
    credentials: true
}));

// Routes

app.post("/login", AuthMiddleware.mustNotLogged, UserController.login);
app.post("/signup", AuthMiddleware.mustNotLogged, UserController.signUp);

app.get("/search", PlaylistController.search);
app.get("/song/download", SongController.download);

app.use(AuthMiddleware.mustBeLogged);

app.get("/auth", AuthController.persistSession);
app.delete("/logout", AuthController.logout);
app.get("/playlist", PlaylistController.getPlaylists);
app.post("/create", imgUploader.single("cover"), PlaylistController.create);
app.get("/playlist/:playlist", PlaylistController.getContent);
app.delete("/playlist/:playlist/delete", PlaylistController.deletePlaylist);
app.post("/playlist/:playlist/add", songsUploader.single("song"), SongController.add);
app.patch("/playlist/:playlist/update", imgUploader.single("cover"), PlaylistController.update);

app.listen(8000, () => {
    console.log("Server is running...");
});


// Setup data storage

if(!fs.existsSync("./public/storage/playlists")) {
    fs.mkdirSync("./public/storage/playlists");
}

// Sync with Database tables

db.sync().then(() => {
    console.log("Connected to Database");
}).catch((error) => {
    console.log(error);
})