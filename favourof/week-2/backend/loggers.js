const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const array = [
  {
    book: "jddlkd",
    bag: '"kdjd',
    keg: "hjhdhj",
  },
  {
    book: "jddlkd",
    bag: '"kdjd',
    keg: "hjhdhj",
  },
  {
    book: "jddlkd",
    bag: '"kdjd',
    keg: "hjhdhj",
  },
];

logger.info(array);
