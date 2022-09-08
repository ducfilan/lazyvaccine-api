import textToSpeech from '@google-cloud/text-to-speech'
import { PassThrough } from 'stream'

const client = new textToSpeech.TextToSpeechClient()

export default class AudioController {
  static async apiGetPronounce(req, res, next) {
    try {
      const request = {
        input: { text: req.query.text },
        voice: { languageCode: req.query.langCode, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      }

      res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked'
      })

      const [response] = await client.synthesizeSpeech(request)
      const bufferStream = new PassThrough()
      bufferStream.end(Buffer.from(response.audioContent))
      bufferStream.pipe(res)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}
