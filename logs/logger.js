const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'file',
      filename: 'logs/everything.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c - %m',
      },
    },
    fileReten: {
      type: 'file',
      filename: 'logs/reten.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c - %m',
      },
    },
    fileETL: {
      type: 'file',
      filename: 'logs/ETL.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c - %m',
      },
    },
  },
  categories: {
    default: {
      appenders: ['console', 'file'],
      level: ['all'],
    },
    reten: {
      appenders: ['console', 'fileReten'],
      level: ['all'],
    },
    ETL: {
      appenders: ['console', 'fileETL'],
      level: ['all'],
    },
  },
});

const logger = log4js.getLogger();
const retenLogger = log4js.getLogger('reten');
const ETLLogger = log4js.getLogger('ETL');

module.exports = { logger, retenLogger, ETLLogger };
