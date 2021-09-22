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

  //to update existing record
  app.put("/books", (req, res) => {
    readFile((data) => {
      const { original_book, new_book, ...remainData } = req?.body?.info;
      console.log("ORIGINAL", original_book, "NEW", new_book);

      if (
        original_book != undefined &&
        original_book?.trim() != "" &&
        new_book != undefined &&
        new_book?.trim() != ""
      ) {
        if (
          original_book?.trim().localeCompare(new_book?.trim()) === 0 ||
          data.books.includes(new_book?.trim())
        ) {
          res.status(400).send({
            status: 400,
            message:
              "Invalid pay load. new_book should be different and it should not be other book name which is alreay existed",
          });
        } else {
          let bookIndex = data.books.indexOf(original_book);
          if (bookIndex != -1) {
            data.books[bookIndex] = new_book;
            writeFile(JSON.stringify(data, null, 2), () => {
              res
                .status(200)
                .send({ status: 200, message: "book name is updated" });
            });
          }
        }
      } else {
        res.status(400).send({
          status: 400,
          message: "Invalid pay load.original_book, new_book are mandatory",
        });
      }
      // if (data[userId] === undefined || data[userId] === "undefined") {
      //   res.status(404).send(`user id:${userId} not existed`);
      // } else {
      //   data[userId] = req.body;
      //   writeFile(JSON.stringify(data, null, 2), () => {
      //     res.status(200).send(`users id:${userId} updated`);
      //   });
      // }
    }, true);
  });

  // to delete existing record
  app.delete("/users/:id", (req, res) => {
    readFile((data) => {
      const userId = req.params["id"];
      if (data[userId] === undefined || data[userId] === "undefined") {
        res.status(404).send(`users id:${userId} not existed`);
      } else {
        delete data[userId];
        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(`users id:${userId} removed`);
        });
      }
    }, true);
  });
};

module.exports = bookRoutes;
