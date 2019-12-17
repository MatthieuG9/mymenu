// Recipes-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import parse from 'coercion';

export default function (app: Application) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const requireOwner = parse.boolean(app.get('insecure')) !== true;

  const instructions = new Schema({
    content: { type: String, required: true }
  }, { _id: false, autoIndex: false });

  const ingredients = new Schema({
    ingredientId: { type: Schema.Types.ObjectId, ref: 'ingredients' },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true, enum: ['unit', 'g', 'ml'], default: 'unit' }
  }, { _id: false, autoIndex: false });

  const details = new Schema({
    instructions: [instructions],
    ingredients: [ingredients]
  }, { _id: false, autoIndex: false });

  const recipes = new Schema({
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'users', required: requireOwner },
    duration: { type: Number, required: true, default: 10, min: 1 },
    serving: { type: Number, required: true, default: 1, min: 1 },
    type: {
      type: String,
      required: true,
      enum: ['link', 'details']
    },
    url: {
      type: String,
      required: function (this: any) {
        return this.type == 'link';
      }
    },
    details: {
      type: details,
      required: function (this: any) {
        return this.type == 'details'
      }
    },
    deletedAt: { type: Number, default: -1 }
  }, {
    timestamps: true
  });

  return mongooseClient.model('recipes', recipes);
}
