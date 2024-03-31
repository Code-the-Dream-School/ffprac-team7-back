const Item = require('../models/Item');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

// Allows a logged in user to POST lost item
const createItem = async (req, res) => {
    try {
        req.body.reportedBy = req.user.userId;
        const item = await Item.create(req.body);
        res.status(StatusCodes.CREATED).json({msg:'The item has been created.', item});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// Allows a user to GET an item by item id
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

// Allowes a user to GET all the items in the database
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({}).sort('createdAt');
        res.status(StatusCodes.OK).json({items, count:items.length});
     
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message); 
    }
}

// Allowes a user to GET all the items a user account has POSTed
const getAllItemsByUser = async (req, res) => {
    try {
        const {
            params: {userId: userId}
        } = req;

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

// Allowes a logged in user to Update (PUT) an item they have POSTed
const updateItem = async (req, res) => {
    try {
        const {
            body: {title, description, location},
            user: {userId},
            params: {itemId: itemId},
        } = req;

        const item = await Item.findOneAndUpdate({_id: itemId, reportedBy: userId}, req.body, {new:true, runValidators:true});

        if (!item) {
            res.status(StatusCodes.NOT_FOUND).json({msg:`The item with id:${itemId} reported by this user was not found.`});

        } else if (title === '')  {
            res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide item title.`});

        } else if (description === '') {
            res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide item description.`});

        } else if (location === '') {
            res.status(StatusCodes.BAD_REQUEST).json({msg:`Please provide the location where the item was lost.`});
        
        }
        res.status(StatusCodes.OK).json({msg:'The item has been updated.', item});  

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message); 
    }
}

// Allowes a logged in user to claim (PUT) ownership of an item with their userId
const claimItem = async (req, res) =>{
    try {
        req.body.lost = false;
        req.body.claimedBy = req.user.userId;
        req.body.dateClaimed = Date.now();

        const {
            params: {itemId: itemId}
        } = req;

        const item = await Item.findOneAndUpdate({_id: itemId}, req.body, {new:true, runValidators:true})

        if (!item) {
            res.status(StatusCodes.NOT_FOUND).json({msg:`The item with id:${itemId} was not found.`});

        }
        res.status(StatusCodes.OK).json({msg:'The item has been successfully claimed.', item});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
}

// Allowes a logged in user to confirm (POST) that the claimer's ownership of the item they have POSTed has been verified
const confirmClaim = async (req, res) => {

    try {
        req.body.claimConfirmed = true;
        
        const {
            user: {userId},
            params: {itemId: itemId}
        } = req

        const item = await Item.findOneAndUpdate({_id:itemId, reportedBy:userId }, req.body, {new:true, runValidators:true});

        if (!item) {
        res.status(StatusCodes.NOT_FOUND).json({msg:`The item with id:${itemId} reported by this user was not found.`});

        }
        res.status(StatusCodes.OK).json({msg:'The claim of this item has successfully been confirmed.', item});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message); 
    }

}

// Allowes a logged in user to DELETE an item they have POSTed
const deleteItem = async (req, res) => {
   try {
        const {
            user: {userId},
            params: {itemId: itemId}
        } = req

        const item = await Item.findOneAndDelete({_id:itemId, reportedBy:userId});

        if (!item) {
            res.status(StatusCodes.NOT_FOUND).json({msg:`The item with id:${itemId} reported by this user was not found.`});

        } else {
            res.status(StatusCodes.OK).json({msg:`The item has been deleted.`});  
        }

   } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message); 
   }
}

// Allowes a logged in user to DELETE an item they have have claimed has their own, 
// after their ownership has been confirmed by the original POSTer
const deleteConfirmedItem = async (req, res) => {
    try {
         const {
             user: {userId},
             params: {itemId: itemId}
         } = req
 
         const item = await Item.findOneAndDelete({ _id:itemId, claimedBy:userId, claimConfirmed:true});
 
         if (!item) {
             res.status(StatusCodes.NOT_FOUND).json({msg:`The item does not exist, or its claim has not yet been confirmed.`});

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
    claimItem, 
    confirmClaim,
    deleteItem,
    deleteConfirmedItem,
}