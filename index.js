const express = require("express");
const bodyparser = require("body-parser");
const connection = require("./database/connection");
const session = require("express-session");

//imports dos controllers
const categoriesController = require("./categories/CategoriesController");
const articleController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

//imports dos models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

const app = express();
const port = 3000;

//carregar view engine
app.set("view engine", "ejs");

//carregar arquivos estatíscos
app.use(express.static("public"));

//carrega biblioteca do express q utiliza sessions
app.use(
  session({
    secret: "qualquercoisa",
    cookie: { maxAge: 30000 },
  })
);

//carregar o body-parser para trabalhar com forms
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//fazendo a conexão ao banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

//Rotas

//Definição de uso dos controllers
app.use("/", categoriesController);
app.use("/", articleController);
app.use("/", usersController);

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 4,
  }).then((articles) => {
    res.render("index", { articles: articles });
  });
});

app.get("/:slug", (req, res) => {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        res.render("article", { article: article });
      } else {
        res.render("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
