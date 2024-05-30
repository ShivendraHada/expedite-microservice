import "dotenv/config";
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import getEnv from "./utils/getEnv";
import { marshall } from "@aws-sdk/util-dynamodb";

const app = express();
app.use(express.json());

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } = getEnv();

// Configure AWS SDK
const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const params = {
      TableName: "Products",
    };

    const { Items } = await dynamoDBClient.send(new ScanCommand(params));
    res.json(Items);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create a new product
app.post("/product/new", async (req, res) => {
  const { productId, name, description, price, category, stock } = req.body;

  if (!productId || !name || !description || !price || !category || !stock) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const product = {
    ProductId: productId,
    Name: name,
    Description: description,
    Price: price,
    Category: category,
    Stock: stock,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  };

  try {
    const params = {
      TableName: "Products",
      Item: marshall(product),
    };

    await dynamoDBClient.send(new PutItemCommand(params));
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update Product
app.put("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updatedProduct = {
    ProductId: productId,
    Name: name,
    Description: description,
    Price: price,
    Category: category,
    Stock: stock,
    UpdatedAt: new Date().toISOString(),
  };

  try {
    const params = {
      TableName: "Products",
      Item: marshall(updatedProduct),
    };

    await dynamoDBClient.send(new PutItemCommand(params));
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const params = {
      TableName: "Products",
      Key: marshall({ ProductId: productId }),
    };

    await dynamoDBClient.send(new DeleteItemCommand(params));
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
