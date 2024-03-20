const express = require('express');
const router = express.Router()
const {
    createItem,
    getItem,
    getAllItems, 
    updateItem,
    deleteItem
} = require('../controllers/itemController');

router.route('/').post(createItem).get(getAllItems);
router.route('/:id').get(getItem).patch(updateItem).delete(deleteItem);

module.exports = router;

