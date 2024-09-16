import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./route";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use defined routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
