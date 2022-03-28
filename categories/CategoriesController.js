const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const Article = require("../articles/Article");

router.get("/admin/categories", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categories/categories", { categories: categories });
  });
});

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
  var title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title, { lower: true }),
    }).then(() => {
      res.redirect("/admin/categories");
      console.log("Categoria" + title + " salva com sucesso");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

router.post("/admin/categories/delete", (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    //verifica se existe
    if (!isNaN(id)) {
      // verifica se é um número
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});

router.get("/admin/categories/edit/:id", (req, res) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/categories");
  }
  Category.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render("admin/categories/edit", { category: category });
      } else {
        res.redirect("/admin/categories");
      }
    })
    .catch((error) => {
      res.redirect("/admin/categories");
    });
});

router.post("/categories/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;

  Category.update(
    { title: title, slug: slugify(title) },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/categories");
  });
});

router.get("/admin/categories/cat_articles/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        res.render("admin/categories/cat_articles", {
          articles: category.articles,

          category: category,
        });
      } else {
        res.redirect("/admin/categories");
      }
    })
    .catch((error) => {
      res.redirect("/admin/categories");
    });
});

module.exports = router;
