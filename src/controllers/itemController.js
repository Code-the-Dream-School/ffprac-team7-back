const Item = require('../models/Item');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const createItem = async (req, res) => {
    try {
        req.body.reportedBy = req.user.userId
        const item = await Item.create(req.body);
        res.status(StatusCodes.CREATED).json({msg:'The item has been created.', item});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// Get a specific item by item id
const getItem = async (req, res) => {
    try {
        const {
            params: {itemId: itemId},
        } = req;
        
        const item = await Item.findOne({_id: itemId});

        if (!item) {
            res.status(StatusCodes.NOT_FOUND).json({msg:`The item with id:${itemId} was not found.`})

        } else {
            res.status(StatusCodes.OK).json({item});  
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
}

// Get all the items in the database
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({}).sort('createdAt');
        res.status(StatusCodes.OK).json({items, count:items.length});
     
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message); 
    }
}

// Get all the items a specific user has reported
const getAllItemsByUser = async (req, res) => {
    try {
        const {
            params: {userId: userId}
        } = req

        const items = await Item.find({reportedBy: userId}).sort('createdAt');
        const user = await User.findOne({_id: userId});

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({msg:`The user with id:${userId} was not found.`});

        } else if (items.length === 0) {
            res.status(StatusCodes.OK).json({msg:'This user has not reported any items yet.'});

        } else {
            res.status(StatusCodes.OK).json({items, count:items.length});
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);   
    }
}

// The req will be updated with the userId in the next PR
const updateItem = async (req, res) => {
    try {
        const {
            body: {title, description, location, lost, dateClaimed, claimedBy},
            params: {itemId: itemId},
        } = req

        const item = await Item.findOneAndUpdate({_id: itemId}, req.body, {new:true, runValidators:true});

        if (!item) {
            res.status(StatusCodes.NOT_FOUND).json({msg:`The item with id:${itemId} was not found.`})

        } else if (title === '')  {
            res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide item title.`});

        } else if (description === '') {
            res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide item description.`});

        } else if (location === '') {
            res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide the location where the item was lost.`});

        } else if (lost === '') {
            res.status(StatusCodes.BAD_REQUEST).json({msg:`Please indicate if the item is lost or not.`});

            // The code below will be updated. The current conditional is not working when (lost===false).
        } else if (lost === false) {
            if (dateClaimed === '') {
                res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide the date the item is being claimed.`});

            } else if (claimedBy === '') {
                res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide the id of the person claiming the item.`});
            }
        }
        res.status(StatusCodes.OK).json({msg:'The item has been updated.', item});  

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message); 
    }
}

// The req will be updated with the userId in the next PR
const deleteItem = async (req, res) => {
   try {
        const {
            params: {itemId: itemId}
        } = req

        const item = await Item.findByIdAndDelete(itemId);

        if (!item) {
            res.status(StatusCodes.NOT_FOUND).json({msg:`The item with id:${itemId} was not found.`});

        } else {
            res.status(StatusCodes.OK).json({msg:`The item has been deleted.`});  
        }

   } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message); 
   }
}

module.exports = {
    createItem,
    getItem,
    getAllItems, 
    getAllItemsByUser,
    updateItem,
    deleteItem
}