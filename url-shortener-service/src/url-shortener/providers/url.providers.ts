
import { Connection } from 'mongoose';
import { UrlSchema } from '../schemas/url.schema';

export const urlProviders = [
  {
    provide: 'URL_MODEL',
    useFactory: (connection: Connection) => connection.model('URL', UrlSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
