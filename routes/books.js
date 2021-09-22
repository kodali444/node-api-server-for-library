const bookRoutes = (app, fs) => {
  const dataPath = "./data/books.json";

  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };
  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }
      callback();
    });
  };

  // to get list of books
  app.get("/getBookList", (req, res) => {
    readFile((data) => {
      res.send(data?.books?.join("~"));
    }, true);
  });
};

module.exports = bookRoutes;
