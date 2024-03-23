const express = require('express');
const router = express.Router()
const {
    createItem,
    getItem,
    getAllItems,
    getAllItemsByUser,
    updateItem,
    deleteItem
} = require('../controllers/itemController');

router.route('/').post(createItem).get(getAllItems);
router.route('/itemsByUser=:userId').get(getAllItemsByUser); //not sure if this is a great way to name a route
router.route('/:itemId').get(getItem).put(updateItem).delete(deleteItem);

module.exports = router;

