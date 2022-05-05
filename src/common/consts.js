export default {
  tokenExpiresIn: '7d',
  tagsSelectLimit: 10,
}

export const SupportingLanguages = ['ar', 'zh', 'nl', 'en', 'de', 'it', 'ja', 'ko', 'mn', 'pt', 'ru', 'sl', 'es', 'vi']
export const SupportingTopSetsTypes = {
  Global: 0,
  Category: 1
}

export const UsersCollectionName = 'users'
export const SetsCollectionName = 'sets'
export const TopSetsCollectionName = 'topSets'
export const InteractionsCollectionName = 'interactions'
export const ItemsInteractionsCollectionName = 'itemsInteractions'

export const LoginTypes = {
  google: 'google'
}

export const BaseCollectionProperties = {
  lastUpdated: new Date(),
  delFlag: false
}

export const SupportingSetTypes = ['term-def', 'question-answers', 'content']

export const CaptchaVerificationUrl = (response) => `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${response}`;

export const DoSpaceName = 'lazy-vaccine-static'
export const DoEndpoint = 'sgp1.digitaloceanspaces.com'
export const DoPreSignExpirationInSecond = 600 // 10 minutes

export const StaticBaseUrl = 'https://static.lazyvaccine.com'
export const SupportingContentTypes = ['image/jpeg', 'image/png']

export const HttpStatusOk = 200
export const HttpStatusBadRequest = 400
export const HttpStatusUnauthorized = 401
export const HttpStatusForbidden = 403
export const HttpStatusInternalServer = 500


export const InteractionSubscribe = 'subscribe'
export const InteractionLike = 'like'
export const InteractionDislike = 'dislike'
export const SetInteractions = [InteractionSubscribe, InteractionLike, InteractionDislike]

export const ItemsInteractionShow = 'show'
export const ItemsInteractionNext = 'next'
export const ItemsInteractionIgnore = 'ignore'
export const ItemsInteractionForcedDone = 'forced-done'
export const ItemsInteractionAnswerCorrect = 'answer-correct'
export const ItemsInteractionAnswerIncorrect = 'answer-incorrect'
export const ItemsInteractions = [ItemsInteractionShow, ItemsInteractionNext, ItemsInteractionAnswerCorrect, ItemsInteractionAnswerIncorrect, ItemsInteractionIgnore, ItemsInteractionForcedDone]

export const MaxPaginationLimit = 100
export const TopItemsLimit = 5