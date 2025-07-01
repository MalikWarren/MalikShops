import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {type: String, required: true},
    team: {type: String, required: true},
    player: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, default: 0},
    countInStock: {type: Number, required: true, default: 0},
    isFeatured: {type: Boolean, default: false},
    numReviews: {type: Number, required: true, default: 0},
    rating: {type: Number, required: true, default: 0},
    reviews: {type: Array, default: []},
    wnbaPlayerId: {type: String},
    jerseyNumber: {type: String},
  },
  {timestamps: true}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
