import express from "express";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import morgan from "morgan";

const app = express();

const morganTemplate =
  ":method :url :status :res[content-length] - :response-time ms";

app.use(morgan(morganTemplate));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Server received a request at /");
  res.send("Welcome to the API");
});
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

export default app;
