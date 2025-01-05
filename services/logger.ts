import pino, { LoggerOptions } from 'pino'

const pinoConfig: LoggerOptions = {
  browser: {
    // disabled: true,
    asObject: false,
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: "yyyy-dd-mm, h:MM:ss TT",
      messageFormat: "[{filename}] {msg}",
      singleLine: true,
      ignore:"filename,hostname"
    }
  },
}

const baseLogger = pino(pinoConfig)

const Logger = (filename: string): pino.Logger => {  
  if(typeof window == "undefined"){
    return baseLogger.child({ filename: filename });
  } else {
    return baseLogger
  }
};


export default Logger