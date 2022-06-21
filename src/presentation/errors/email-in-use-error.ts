export class EmailInUseError extends Error {
  constructor () {
    super('The received email is alredy use')
    this.name = 'EmailInUseError'
  }
}
