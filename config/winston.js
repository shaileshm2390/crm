'use strict';

/**
 * Created by Junaid Anwar on 5/28/15.
 */
var winston = require('winston');

//var logger = new (winston.Logger)();
var logger = winston.createLogger({
  level: 'verbose',
   prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false,
    transports: [
      new winston.transports.Console({
          timestamp: true,
      }),
      new winston.transports.File({
          filename: 'app.log',
          timestamp: true,
      })
    ]
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

module.exports = logger;
