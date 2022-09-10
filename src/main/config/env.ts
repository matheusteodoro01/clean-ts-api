export default ({
  mongoUrl: process.env.MONGO_URL ?? 'mongodb+srv://matheusteodoro01:16194830@clean-ts-api.ksakseu.mongodb.net/?retryWrites=true&w=majority',
  port: process.env.PORT ?? '5050',
  jtwSecret: process.env.JWT_SECRET ?? 'frfg%&&HGHBVr'
})
