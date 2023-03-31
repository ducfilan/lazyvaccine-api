import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { DoSpaceName, DoEndpoint, DoPreSignExpirationInSecond, SupportingContentTypes, HttpStatusBadRequest, S3RegionSEA } from '@common/consts'

const client = new S3Client({
  region: S3RegionSEA,
  endpoint: DoEndpoint,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET
  },
});


export default class ImagesController {
  static async apiGetPreSignedUrl(req, res, next) {
    if (!validateRequest(req)) {
      res.status(HttpStatusBadRequest)
    }

    try {
      const command = new PutObjectCommand({
        Bucket: DoSpaceName,
        Key: req.body.fileName,
        ContentType: req.body.contentType,
        ACL: 'public-read',
      })

      const url = getSignedUrl(client, command, { expiresIn: DoPreSignExpirationInSecond })

      return res.json({ url })
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}

function validateRequest(req) {
  const { fileName, contentType } = req.body

  if (!fileName || !contentType) {
    return false
  }

  return !!(SupportingContentTypes.includes(contentType))
}
