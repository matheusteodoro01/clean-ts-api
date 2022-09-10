export const unauthorized = {
  description: 'Credenciais Invalidas',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
