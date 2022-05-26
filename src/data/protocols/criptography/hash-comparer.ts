
export interface HashCompare {
  compare: (password: string, hashPassword) => Boolean
}
