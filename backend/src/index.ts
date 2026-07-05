import express from "express";
import { userRouter } from "./routes/user";
import cors from "cors";
import { accountRouter } from "./routes/account";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter)

app.listen(3000, () => {
  console.log("Server running");
});