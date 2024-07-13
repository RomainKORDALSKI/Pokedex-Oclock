import "dotenv/config";
import express from "express";
import cors from "cors";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
    
import { router } from "./routers/index.js";
import { bodySanitizer } from "./middlewares/sanitizeHtml.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

export const app = express();

app.use(cors({origin: process.env.ALLOWED_DOMAINS}));

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(bodySanitizer);
app.use(router);

app.listen(port, () => {
  console.log(`🚀 Server ready: http://localhost:${port}`);
});