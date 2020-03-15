import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import passport from 'passport'
// import winston from 'winston'

// models
import products from './routes/api/v1/products'
import categories from './routes/api/v1/categories'
import brands from './routes/api/v1/brands'
import users from './routes/api/v1/users'

// middlewares
import { passportMiddleware } from './config/midllewares/passport'

// // Logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.simple(),
//   transports: [
//     //
//     // - Write to all logs with level `info` and below to `combined.log`
//     // - Write all logs error (and below) to `error.log`.
//     //
//     // new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     // new winston.transports.File({ filename: 'combined.log' })
//     new winston.transports.Console({
//       format: winston.format.simple()
//     })
//   ]
// })

require('dotenv').config() // reads env file
console.log(process.env.MONGO_URI)

mongoose.Promise = global.Promise
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

const app = express()

app.disable('x-powered-by')

// middlewares
app.use(bodyParser.json())

app.use(passport.initialize())
passportMiddleware(passport)

// set api routes
app.use('/api/v1/products', products)
app.use('/api/v1/categories', categories)
app.use('/api/v1/brands', brands)
app.use('/api/v1/users', users)

// if (process.env.NODE_ENV !== 'production') {
//   console.log('NODE_ENV: ', process.env.NODE_ENV)
//   // logger.add(new winston.transports.Console(options))
//   logger.info('What rolls down stairs; Hello from winston')
// }

app.get('/', (req, res) => {
  res.send('<h1>App server is running</h1>')
})

const port = process.env.PORT || 8080 // @TODO: setup env.variable
app.listen(port, () => console.log(`Started on ${port}`))
