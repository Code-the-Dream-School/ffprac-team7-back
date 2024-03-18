const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema( 
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
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
            ref: 'User', //subject to change depending on user model
            required: true,
        },
        dateClaimed: {
            type: Date,
            required: false,
        },
        claimedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User', //subject to change depending on user model
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