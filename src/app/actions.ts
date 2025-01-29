"use server"
import axios from "axios"
import { getAuthenticatedUser } from "@/AppComponents/SessionUser"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
  }
})

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm"
]

const maxFileSize = 1024 * 1024 * 10

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { failure: "User not Authenticated!" }
  }

  if (!acceptedTypes.includes(type)) {
    return { failure: "Invalid file Type" }
  }

  if (size > maxFileSize) {
    return { failure: "file size over 10MB" }
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      user: user.id
    }
  })
  // Awaiting the result to get the signed URL
  const signedURL = await getSignedUrl(s3Client, putObjectCommand, {
    expiresIn: 3000
  })
  return { success: { url: signedURL } }
}


export async function deleteMedia(mediaUrl : string){
    const user = await getAuthenticatedUser()
    if (!user) {
      return { failure: "User not Authenticated!" }
    }

    const deleteObjectCommand = new DeleteObjectCommand({
        Bucket :process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key : mediaUrl.split("/").pop()!
    })

   const response =  await s3Client.send(deleteObjectCommand)
   console.log(response)
}

