const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema( 
    {
        title: {
            type: String,
            required: [true, 'Please provide an item title'],
        },
        description: {
            type: String,
            required: [true, 'Please provide an item description'],
        },
        location: {
            type: String,
            required: [true, 'Please enter the location where the item was lost'],
        },
        lost: {
            type: Boolean,
            required: true,
            default: true,
        },
        dateReported: {
            type: Date,
            required: true,
            default: Date.now()
        },
        reportedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dateClaimed: {
            type: Date,
            required: [false, 'Please provide the date the item is being claimed'],
        },
        claimedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [false, 'Please provide the id of the person claiming this item']
        },
        claimConfirmed: {
            type: Boolean,
            required: false,
        },
    }, 
    { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);