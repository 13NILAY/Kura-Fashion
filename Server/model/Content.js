const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        // required: true,
        enum: ['about', 'privacy', 'terms', 'shipping', 'refund']
    },
    title: {
        type: String,
        // required: true
    },
    content: [
    {
        contentTitle: {
        type: String,
        // required: true
    },
    contentInfo: {
        type: String,
        // required: true
    }
    }
    ],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    }
});

module.exports = mongoose.model('Content', contentSchema);
