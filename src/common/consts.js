export default {
  tokenExpiresIn: '7d',
  tagsSelectLimit: 10,
}

export const SupportingLanguages = ['ar', 'zh', 'nl', 'en', 'de', 'it', 'ja', 'ko', 'mn', 'pt', 'ru', 'sl', 'es', 'vi']

export const UserCollectionName = 'users'
export const SetCollectionName = 'sets'

export const LoginTypes = {
  google: 'google'
}

export const BaseCollectionProperties = {
  lastUpdated: new Date(),
  delFlag: false
}

export const SupportingSetTypes = ['term-def', 'question-answers', 'content']

export const CaptchaVerificationUrl = (response) => `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${response}`;
