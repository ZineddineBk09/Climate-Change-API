const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio"); //"cheerio" is a web scrapping node package
const { response } = require("express");
const PORT = 3000;

const app = express();

const newspapers = [
  {
    name: "cityam",
    address:
      "https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/",
    base: "",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/international/section/climate",
    base: "",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/environment",
    base: "",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "un",
    address: "https://www.un.org/climatechange",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
  {
    name: "dm",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
  {
    name: "nyp",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
];

newspapers.map((newspaper) => {
  axios
    .get(newspaper.address)
    .then(function (response) {
      const html = response.data;
      //console.log(html);
      //syntax of cheerio
      const $ = cheerio.load(html);

      $(`a:contains("climate")`, html).each(function () {
        const title = $(this).text(); //to get the article title
        const url = $(this).attr("href"); //to get the link from the "a" tag

        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/", function (req, res) {
  res.json("Welcome to my weather API");
});

const articles = [];

app.get("/news", function (req, res) {
  //await axios
  // .get("https://www.theguardian.com/environment/climate-crisis")
  // .then(function (response) {
  //const html = response.data;
  //   console.log(html);
  //syntax of cheerio
  //  const $ = cheerio.load(html);
  //  $(`a:contains("climate")`, html).each(function () {
  //   const title = $(this).text(); //to get the article title
  //   const url = $(this).attr("href"); //to get the link from the "a" tag
  //   articles.push({
  //     title,
  //     url,
  //   });
  //});
  // res.json(articles);
  // })
  //  .catch(function (err) {
  //    console.log(err);
  //  });

  res.json(articles);
});

app.get("/news/:newspaperId", function (req, res) {
  //we'll use the req.params to see what newspaper the user selected
  console.log(req.params);

  const newspaperId = req.params.newspaperId;

  //get the newspaper selected
  const newspaper = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0];

  //console.log(newspaper);
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const speceficArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        speceficArticles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
      res.json(speceficArticles);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(PORT, () => console.log("server is running on ", PORT));

//Now you can scall it even more and see what article the user selected
