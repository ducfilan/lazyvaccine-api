import '@babel/register'
import { config } from 'dotenv'

config()

exports = module.exports = require('./src')
