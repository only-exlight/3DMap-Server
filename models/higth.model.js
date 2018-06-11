import mongoose from 'mongoose';
let Schema = mongoose.Schema;

const Model = new Schema({
    elevation: {
        type: Number,
        required: true,
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    resolution: {
         type: Number,
         required: true
     }
});

export const HigthModel = mongoose.model('higthts', Model);