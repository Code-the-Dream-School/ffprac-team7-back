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
        },
        reportedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dateClaimed: {
            type: Date,
            required: false,
        },
        claimedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: () => {
                if (dateClaimed === true) {
                    return true;
                } else { return false; }
            },
        },
        claimConfirmed: {
            type: Boolean,
            required: false,
        },
    }, 
    { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);