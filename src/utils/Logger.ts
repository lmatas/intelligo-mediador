import { createLogger, transports, format, Logger } from "winston";
import * as winston from "winston";
import  'winston-daily-rotate-file';
import appRoot from 'app-root-path';

const transport = new winston.transports.DailyRotateFile({
    filename: `${appRoot}/logs/intelligo-mediator-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '15d'
  });

export const logger = createLogger({
    transports: [
        transport,
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
        })
    ],
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, service }) => {
            return `[${timestamp}] ${service} ${level}: ${message}`;
        })
    ),
    defaultMeta: {
        service: "intelligo-mediator",
    },
});

