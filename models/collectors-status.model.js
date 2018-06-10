import mongoose from 'mongoose';
let Schema = mongoose.Schema;

const Model = new Schema({
    higthCollector: {
        city: {
            type: String
        },
        currentX: {
            type: Number,
        },
        currentY: {
            type: Number
        }
    }
});

export const CollectorsStatus = mongoose.model('collectors-status', Model);