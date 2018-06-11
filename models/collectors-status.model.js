import mongoose from 'mongoose';
let Schema = mongoose.Schema;

const Model = new Schema({
    higthCollector: {
        city: {
            type: String,
            unique: true
        },
        currentX: {
            type: Number,
        },
        currentY: {
            type: Number
        },
        queryWasDone: {
            type: Number
        },
        queryHaveErr: [
            {
                url: String,
                errMsg: String
            }
        ]
    }
});

export const CollectorsStatus = mongoose.model('collectors-status', Model);