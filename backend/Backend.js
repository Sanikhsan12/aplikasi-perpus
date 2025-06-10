import express from "express";
import cors from "cors";
import UserRouter from "./routes/UserRouter.js";
import BookRouter from "./routes/BookRouter.js";
import AuthRouter from "./routes/AuthRouter.js";
import PinjamRouter from "./routes/PinjamRouter.js";
import PengembalianRouter from "./routes/PengembalianRouter.js";
import dotenv from "dotenv";
import db from "./config/Database.js";

dotenv.config();
const app = express();

// singkronisasi database
(async () => {
  await db.sync();
})();

app.use(cors());
app.use(express.json());

// using routes
app.use(UserRouter);
app.use(BookRouter);
app.use(AuthRouter);
app.use(PinjamRouter);
app.use(PengembalianRouter);

app.listen(5000, () => {
  console.log("server jalan di port 5000 euy");
});
