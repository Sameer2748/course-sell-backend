import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { config } from "../config"
import crypto from "crypto"
import type { Express } from "express"

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId!,
    secretAccessKey: config.aws.secretAccessKey!,
  },
})

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const fileKey = `${crypto.randomUUID()}-${file.originalname}`

  const params = {
    Bucket: config.aws.s3BucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  }

  try {
    await s3Client.send(new PutObjectCommand(params))
    return `https://${config.aws.s3BucketName}.s3.${config.aws.region}.amazonaws.com/${fileKey}`
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw new Error("Failed to upload file to S3")
  }
}
