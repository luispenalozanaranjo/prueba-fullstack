import ApiGateway from "moleculer-web";
import { basicAuth } from "../utils/auth.js";
import dotenv from "dotenv";
dotenv.config();

export default {
  name: "api",
  mixins: [ApiGateway],
  settings: {
    port: process.env.PORT || 3001,
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
    routes: [
      {
        path: "/api",
        authorization: false,
        use: [basicAuth],
        aliases: {
          "GET books/search": "books.search",
          "GET books/last-search": "books.lastSearch",
          "POST books/my-library": "books.save",
          "GET books/my-library": "books.list",
          "GET books/my-library/:id": "books.getById",
          "PUT books/my-library/:id": "books.update",
          "DELETE books/my-library/:id": "books.remove",
          "GET books/library/front-cover/:id": "books.coverById",
        },
      },
    ],
    onError(req, res, err) {
      this.logger.error("[API ERROR]", err);
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.writeHead(err.code || 500);
      res.end(JSON.stringify({ error: err.message }));
    },
  },
};
