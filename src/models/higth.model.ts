import { Schema, model, SchemaType,  } from 'mongoose';
import * as GeoJSON from 'mongoose-geojson-schema';

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

export const HigthModel = model('higthts', Model);