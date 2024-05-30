import { DeleteItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import dynamoDBClient from "../utils/dynamoDb";

export default async function DeleteProduct(req: Request, res: Response) {
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
}
