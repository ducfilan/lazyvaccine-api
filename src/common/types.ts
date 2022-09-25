export type User = {
  _id: string,
  name: string,
  email: string,
  locale: string,
  pictureUrl: string,
  finishedRegisterStep: number,
  langCodes?: string[],
  pages?: string[],
}
