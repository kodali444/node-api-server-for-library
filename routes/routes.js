const bookRoutes = require("./books");
const appRouter = (app, fs) => {
  // To handle empty routes
  app.get("/", (req, res) => {
    res.send("welcome to books library");
  });

  bookRoutes(app, fs);
};
module.exports = appRouter;
