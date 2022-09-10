import express from 'express'
import setupMiddewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './config-swagger'

const app = express()

setupSwagger(app)
setupMiddewares(app)
setupRoutes(app)

export default app
