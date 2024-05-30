import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import getEnv from "./getEnv";

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } = getEnv();

// Configure AWS SDK
const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export default dynamoDBClient;
