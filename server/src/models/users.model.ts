// Users-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';

export default function (app: Application) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const users = new Schema({
    googleId: String,
    profilePicture: String,
    email: { type: String, required: true }
  }, {
    timestamps: true,
    strict: false
  });

  return mongooseClient.model('users', users);
}
