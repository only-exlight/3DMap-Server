import { Schema, model } from 'mongoose';

const Model = new Schema({
    collectorType: {
        type: String,
        enum: ['higth-collector'],
        unique: true
    },
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
    queryHaveErr: [{
        url: String,
        errMsg: String
    }],
    lastStart: {
        type: Date,
        required: true,
        default: new Date()
    }
});

export const CollectorsStatus = model('collectors-status', Model);