import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import dynamoDBClient from "../utils/dynamoDb";

export default async function UpdateProduct(req: Request, res: Response) {
  const { productId } = req.params;
  const { newProductId, name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updatedProduct = {
    ProductId: newProductId,
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
}
