import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import dynamoDBClient from "../utils/dynamoDb";

export default async function CreateProduct(req: Request, res: Response) {
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
}
