export class UnautrorizedError extends Error {
  constructor () {
    super('Unautrorized')
    this.name = 'UnautrorizedError'
  }
}
