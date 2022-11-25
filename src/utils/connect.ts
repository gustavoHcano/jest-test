import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connectToDb() {
  const dbUri = config.get<string>('dbURI')
  try {
    return await mongoose.connect(dbUri);
    logger.info('Connected');
  } catch (error) {
    logger.error('Could not connect');
    process.exit(1);
  }
}

export default connectToDb;