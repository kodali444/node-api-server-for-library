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
      res.status(200).send({
        namesList: data?.books?.join("~"),
        message: "Books string with ~ seperator",
      });
    }, true);
  });

  // to add book to library
  app.post("/books", (req, res) => {
    readFile((data) => {
      let isExisted = false;

      if (req?.body?.book != undefined && req?.body?.book.trim() != "") {
        if (data.books.includes(req?.body?.book.trim())) {
          res
            .status(409)
            .send({ status: 409, message: "book name already added" });
        } else {
          data.books.push(req.body.book);
          writeFile(JSON.stringify(data, null, 2), () => {
            res
              .status(200)
              .send({ status: 200, message: "Book added successfully" });
          });
        }
      } else {
        res.status(404).send({ status: 404, message: "Invalid payload" });
      }
    }, true);
  });
};

module.exports = bookRoutes;
