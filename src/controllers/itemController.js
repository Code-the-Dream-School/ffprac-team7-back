const Item = require("../models/Item");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

// Allows a logged in user to POST lost item
const createItem = async (req, res, next) => {
    try {
        req.body.reportedBy = req.user.userId;
        const item = await Item.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ 
        message: "The item has been created.", 
        title: item.title,
        description: item.description,
        location: item.location,
        lost: item.lost,
        itemId: item._id,
        dateReported: item.createdAt,
        reportedByuserId: item.reportedBy
      });
    } catch (error) {
    next(error);
}
};

// Allows a user to GET an item by item id
const getItem = async (req, res, next) => {
    try {
        const {
      params: { itemId: itemId },
        } = req;
        
    const item = await Item.findOne({ _id: itemId });

        if (!item) {
      throw new NotFoundError();
        } else {
      res.status(StatusCodes.OK).json({ item });
        }
    } catch (error) {
    next(error);
}
};

// Allows a user to GET all the items in the database
const getAllItems = async (req, res, next) => {
    try {
    const items = await Item.find({}).sort("createdAt");
    res.status(StatusCodes.OK).json({ items, count: items.length });
    } catch (error) {
    next(error);
}
};

// Allows a user to GET all the items a user account has POSTed
const getAllItemsByUser = async (req, res, next) => {
    try {
        const {
      params: { userId: userId },
        } = req;

    const items = await Item.find({ reportedBy: userId }).sort("createdAt");
    const user = await User.findOne({ _id: userId });

        if (!user) {
      throw new NotFoundError(`The user with id:${userId} was not found.`);
        } else if (items.length === 0) {
      res
        .status(StatusCodes.OK)
        .json({ msg: "This user has not reported any items yet." });
        } else {
      res.status(StatusCodes.OK).json({ items, count: items.length });
        }
    } catch (error) {
    next(error);
}
};

// Allows a logged in user to Update (PUT) an item they have POSTed
const updateItem = async (req, res, next) => {
    try {
        const {
      body: { title, description, location },
      user: { userId },
      params: { itemId: itemId },
        } = req;

    const item = await Item.findOneAndUpdate(
      { _id: itemId, reportedBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

        if (!item) {
      throw new NotFoundError();
    } else if (title === "") {
      throw new BadRequestError();
    } else if (description === "") {
      throw new BadRequestError();
    } else if (location === "") {
      throw new BadRequestError();
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: "The item has been updated.", item });
  } catch (error) {
    next(error);
    }
};

// Allows a logged in user to claim (PUT) ownership of an item with their userId
const claimItem = async (req, res, next) => {
    try {
      req.body.lost = false;
      req.body.claimedBy = req.user.userId;
      req.body.dateClaimed = Date.now();

      const {
       params: { itemId: itemId },
      } = req;

    const item = await Item.findOneAndUpdate({ _id: itemId }, req.body, {
      new: true,
      runValidators: true,
    });

        if (!item) {
      throw new NotFoundError();
    }
    res
      .status(StatusCodes.OK)
      .json({ 
       msg: "The item has been successfully claimed.",
       title: item.title,
       description: item.description,
       location: item.location,
       itemId: item._id,
       lost: item.lost,
       claimedBy: item.claimedBy,
       dateClaimed: item.dateClaimed
      });
  } catch (error) {
    next(error);
    }
};

// Allows a logged in user to confirm (POST) that the claimer's ownership of the item they have POSTed has been verified
const confirmClaim = async (req, res, next) => {
    try {
      req.body.claimConfirmed = true;
        
      const {
        user: { userId },
        params: { itemId: itemId },
      } = req;

      const item = await Item.findOneAndUpdate(
      { _id: itemId, reportedBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

      if (!item) {
       throw new NotFoundError();
      }
      res.status(StatusCodes.OK).json({
      msg: "The claim of this item has successfully been confirmed.",
      title: item.title,
      description: item.description,
      location: item.location,
      itemId: item._id,
      lost: item.lost,
      claimedBy: item.claimedBy,
      dateClaimed: item.dateClaimed, 
      claimConfirmed: item.claimConfirmed
    });
  } catch (error) {
    next(error);
    }
};

// Allows a logged in user to DELETE an item they have POSTed
const deleteItem = async (req, res, next) => {
   try {
        const {
      user: { userId },
      params: { itemId: itemId },
    } = req;

    const item = await Item.findOneAndDelete({
      _id: itemId,
      reportedBy: userId,
    });

        if (!item) {
      throw new NotFoundError();
        } else {
      res.status(StatusCodes.OK).json({ msg: `The item has been deleted.` });
        }
   } catch (error) {
    next(error);
}
};

// Allows a logged in user to DELETE an item they have have claimed has their own,
// after their ownership has been confirmed by the original POSTer
const deleteConfirmedItem = async (req, res, next) => {
    try {
         const {
      user: { userId },
      params: { itemId: itemId },
    } = req;
 
    const item = await Item.findOneAndDelete({
      _id: itemId,
      claimedBy: userId,
      claimConfirmed: true,
    });
 
         if (!item) {
      throw new NotFoundError();
         } else {
      res.status(StatusCodes.OK).json({ msg: `The item has been deleted.` });
         }
    } catch (error) {
    next(error);
    }
};

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
};
