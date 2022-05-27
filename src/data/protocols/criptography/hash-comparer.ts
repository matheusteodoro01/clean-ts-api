
export interface HashComparer {
  compare: (password: string, hashPassword) => Boolean
}
