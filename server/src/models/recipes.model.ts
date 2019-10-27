// Recipes-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';

export default function (app: Application) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const ingredients = new Schema({
    ingredientId : { type: Schema.Types.ObjectId, ref: 'ingredients' },
    quantity: { type: Number, required: true},
    unit: { type: String, required: true, enum: ['unit', 'g', 'ml'], default: 'unit'}
  },{ _id: false, autoIndex: false });

  const details = new Schema({
    instructions: [String],
    ingredients: [ ingredients ]
  }, { _id: false, autoIndex: false });

  const recipes = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'users' },
    type: { 
      type: String, 
      required: true, 
      enum: ['link','details'] 
    },
    url: { 
      type: String, 
      required: function(this:any) {
        return this.type == 'link';
      }  
    },
    details: {
      type: details,
      required: function(this:any) {
        return this.type == 'details'
      }
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('recipes', recipes);
}
