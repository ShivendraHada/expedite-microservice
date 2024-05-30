import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { Request, Response } from "express";
import dynamoDBClient from "../utils/dynamoDb";

export default async function GetAllProduct(req: Request, res: Response) {
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
}
