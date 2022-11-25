import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function disconnectToDb() {
  const dbUri = config.get<string>('dbURI')
  try {
    await mongoose.connection.close()
    logger.info('Disconnected');
  } catch (error) {
    logger.error('Could not disconnect');
    process.exit(1);
  }
}

export default disconnectToDb;