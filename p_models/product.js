const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'veg', 'others']
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
});

module.exports = mongoose.model('Product', ProductSchema);