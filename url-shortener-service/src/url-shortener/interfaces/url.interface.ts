
import { Document } from 'mongoose';

export interface URL extends Document {
  readonly url: string;
}
