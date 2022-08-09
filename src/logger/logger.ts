import * as winston from 'winston'
import 'winston-daily-rotate-file'
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston'
import * as Transport from 'winston-transport'
import { isString } from '@nestjs/common/utils/shared.utils'
console.log(process.env.NODE_ENV)
const transports: Transport[] = [
  new winston.transports.DailyRotateFile({
    filename: '%DATE%.json',
    dirname: 'logs/json',
    json: true,
    datePattern: 'YYYY-MM-DD',
    maxFiles: '10d',
    utc: true,
    auditFile: 'logs/json/audit.json',
    level: 'error',
    format: winston.format.combine(
      winston.format.uncolorize(),
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.logstash()
    ),
  }),
  new winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    dirname: 'logs/log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '10d',
    utc: true,
    auditFile: 'logs/log/audit.json',
    level: 'error',
    format: winston.format.combine(
      winston.format.uncolorize(),
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    level: 'debug',
    dirname: './',
    filename: 'debug.log',
  }),
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike('Odyssey Adapter', {
        colors: true,
        prettyPrint: true,
      })
    ),
  }),
]

type LoggerInstanceConfig = {
  loggerHost?: string
  loggerPort?: number
}

export default class Logger {
  static getInstance({
    loggerHost: host = undefined,
    loggerPort: port = undefined,
  }: LoggerInstanceConfig) {
    const logTransports: Transport[] = [...transports]

    if (
      isString(host) &&
      host.length > 0 &&
      Number.isInteger(port) &&
      port >= 0 &&
      port < 65536
    ) {
      logTransports.push(
        new winston.transports.Http({
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.json()
          ),
          level: 'error',
          host,
          port,
        })
      )
    }

    return WinstonModule.createLogger({
      transports: logTransports,
    })
  }
}
