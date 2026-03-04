import * as mongoose from 'mongoose';
import configuration from 'config/configuration';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      try {
        const uri = configuration().db.mongodbUri;

        const connection = await mongoose.connect(uri);

        console.log('✅ MongoDB connected successfully');
        console.log(`📍 Host: ${connection.connection.host}`);
        console.log(`📦 Database: ${connection.connection.name}`);
        return connection;
      } catch (error) {
        console.error('❌ MongoDB connection failed');
        console.error(error);
        throw error;
      }
    },
  },
];
