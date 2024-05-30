import "dotenv/config";
import express from "express";
import GetAllProduct from "./handlers/getAllProductHandler";
import CreateProduct from "./handlers/createProductHandler";
import UpdateProduct from "./handlers/updateProductHandler";
import DeleteProduct from "./handlers/deleteProductHandler";

const app = express();

app.use(express.json());

// Get all products
app.get("/products", GetAllProduct);

// Create a new product
app.post("/product/create", CreateProduct);

// Update Product
app.put("/product/:productId", UpdateProduct);

// Delete Product
app.delete("/product/:productId", DeleteProduct);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
