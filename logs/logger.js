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
      filename: 'logs/errorReten.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c - %m',
      },
    },
    filePenjanaanReten: {
      type: 'file',
      filename: 'logs/penjanaanReten.log',
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
    fileStatistik: {
      type: 'file',
      filename: 'logs/statistik.log',
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
    errorReten: {
      appenders: ['console', 'fileReten'],
      level: ['all'],
    },
    penjanaanReten: {
      appenders: ['console', 'filePenjanaanReten'],
      level: ['all'],
    },
    ETL: {
      appenders: ['console', 'fileETL'],
      level: ['all'],
    },
    statistik: {
      appenders: ['console', 'fileStatistik'],
      level: ['all'],
    },
  },
});

const logger = log4js.getLogger();
const errorRetenLogger = log4js.getLogger('errorReten');
const penjanaanRetenLogger = log4js.getLogger('penjanaanReten');
const ETLLogger = log4js.getLogger('ETL');
const statistikLogger = log4js.getLogger('statistik');

module.exports = {
  logger,
  errorRetenLogger,
  penjanaanRetenLogger,
  ETLLogger,
  statistikLogger,
};
