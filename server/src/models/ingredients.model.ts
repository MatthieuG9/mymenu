// Ingredients-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';

export default function (app: Application) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const ingredients = new Schema({
    name: { type: String, required: true,  index: true, unique: true },
    deletedAt: { type: Number, default: -1 }
  }, {
    timestamps: true
  });

  return mongooseClient.model('ingredients', ingredients);
}
