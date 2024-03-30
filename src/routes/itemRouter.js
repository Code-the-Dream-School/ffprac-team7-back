const express = require('express');
const router = express.Router()
const {
    createItem,
    getItem,
    getAllItems,
    getAllItemsByUser,
    updateItem,
    claimItem,
    deleteItem
} = require('../controllers/itemController');

router.route('/').post(createItem).get(getAllItems);
router.route('/byUser/:userId').get(getAllItemsByUser); //not sure if this is a great way to name a route
router.route('/:itemId').get(getItem).put(updateItem).delete(deleteItem);
router.route('/:itemId/claim').put(claimItem);

module.exports = router;

