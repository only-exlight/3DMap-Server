import 'mongoose-geojson-schema';
import { Schema, model } from 'mongoose';
 
var Model = new Schema({
    elevation: {
        type: Number,
        required: true
    },
    point: {
        type: Schema.Types.Point,
        required: true
    },
    resolution: {
        type: Number,
        required: true
    }
});

export const HigthModel = model('elevation', Model);