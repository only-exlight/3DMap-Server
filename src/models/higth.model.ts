import 'mongoose-geojson-schema';
import { Schema, model } from 'mongoose';
 
const Model = new Schema({
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
export interface HigthModelDocument {
    elevation: number;
    resolution: number;
    point: Point;
};

interface Point {
    type: 'Point';
    coordinates: [number, number];
}