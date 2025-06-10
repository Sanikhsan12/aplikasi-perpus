import express from "express";
import cors from "cors";
import UserRouter from "./routes/UserRouter.js";
import BookRouter from "./routes/BookRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

// using routes
app.use(UserRouter);
app.use(BookRouter);

app.listen(5000, () => {
  console.log("server jalan di port 5000 euy");
});
