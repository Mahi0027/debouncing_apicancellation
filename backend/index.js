import express from "express";

const PORT = 3000;
const app = express();

const products = [
  {
    id: 1,
    name: "apple",
    type: "fruit",
  },
  {
    id: 2,
    name: "mango",
    type: "fruit",
  },
  {
    id: 3,
    name: "potato",
    type: "vegitable",
  },
  {
    id: 4,
    name: "garlic",
    type: "vegitable",
  },
  {
    id: 5,
    name: "chilli",
    type: "vegitable",
  },
];

app.get("/api/product", (req, res) => {
  let resData = products;
  if (req.query.search) {
    resData = products.filter((product) =>
      product.name.includes(req.query.search)
    );
  }
  setTimeout(() => {
    res.send(resData);
  }, 3000);

  return;
});

app.listen(PORT, () => {
  console.log("server is running on ", 3000);
});
