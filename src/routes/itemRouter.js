const express = require('express');
const router = express.Router()
const {
    createItem,
    getItem,
    getAllItems,
    getAllItemsByUser,
    updateItem,
    claimItem,
    confirmClaim,
    deleteItem,
    deleteConfirmedItem
} = require('../controllers/itemController');

// Swagger components
/**
 * @swagger
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        in: header
 *        name: Authorization
 *        scheme: bearer
 *        bearerFormat: JWT
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      CreateItemRequest:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *            required: true
 *            description: Title of the lost item.
 *            example: Rain Jacket 
 *          description:
 *            type: string
 *            required: true
 *            description: Description of the lost item.
 *            example: A green rain jacket was found in in a park near Venice beach
 *          location:
 *            type: string
 *            required: true
 *            description: Location where the item was found.
 *            example: Los Angeles, CA
 *          lost:
 *            type: boolean
 *            required: true
 *            description: Is the item currently lost?
 *            example: true
 *          dateReported:
 *            type: string
 *            required: true
 *            description: Date that the lost item was reported.
 *            example: 2024-04-21T18:48:31.411Z
 *      ItemResponse:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *            required: true
 *            description: Title of the lost item.
 *            example: Rain Jacket 
 *          description:
 *            type: string
 *            required: true
 *            description: Description of the lost item.
 *            example: A green rain jacket was found in in a park near Venice beach
 *          location:
 *            type: string
 *            required: true
 *            description: Location where the item was found.
 *            example: Los Angeles, CA
 *          lost:
 *            type: boolean
 *            required: true
 *            description: Is the item currently lost?
 *            example: true
 *          itemId:
 *            type: string
 *            description: ItemId of the lost item in the StuffFindr database.
 *            example: 6625601fd050eb176b2165b4
 *          dateReported:
 *            type: string
 *            required: true
 *            description: Date that the lost item was reported.
 *            example: 2024-04-21T18:48:31.411Z
 *          reportedBy:
 *            type: string
 *            required: true
 *            description: StuffFindr userId of the user that reported the item. 
 *            example: 6624306847cf7dfa1a54b917
 */



// Item routes with Swagger documentation

/**
 * @swagger
 * /items/:
 *   post:
 *     tags: 
 *        - Item Routes
 *     summary: Add a lost item
 *     description: Create a lost item entry into StuffFindr.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItemRequest'
 *     responses:
 *       '200':
 *         description: Response after successfully adding a lost item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
*/
router.route('/').post(createItem)

/**
 * @swagger
 * /items/:
 *   get:
 *     tags: 
 *        - Item Routes
 *     summary: Get all the lost item entries
 *     description: Find all the lost item entries in StuffFindr.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Response after successfully finding all the lost items in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Title of the lost item.
 *                   example: Rain Jacket 
 *                 description:
 *                   type: string
 *                   description: Description of the lost item.
 *                   example: A green rain jacket was found in in a park near Venice beach
 *                 location:
 *                   type: string
 *                   description: Location where the item was found.
 *                   example: Los Angeles, CA
 *                 lost:
 *                   type: boolean
 *                   description: Is the item currently lost?
 *                   example: true
 *                 itemId:
 *                   type: string
 *                   description: ItemId of the lost item in the StuffFindr database.
 *                   example: 6625601fd050eb176b2165b4
 *                 dateReported:
 *                   type: string
 *                   description: Date that the lost item was reported.
 *                   example: 2024-04-21T18:48:31.411Z
 *                 reportedByUserId:
 *                   type: string
 *                   description: StuffFindr userId of the user that reported the item.
 *                   example: 6624306847cf7dfa1a54b917
*/
router.route('/').get(getAllItems);

/**
 * @swagger
 * /items/:
 *   get:
 *     tags: 
 *        - Item Routes
 *     summary: Get all the lost item entries by a specific user
 *     description: Find all the lost item entries in StuffFindr by a specific user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The StuffFindr account userId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6624306847cf7dfa1a54b917
 *     responses:
 *       '200':
 *         description: Response after successfully finding all the lost items in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
*/
router.route('/byUser/:userId').get(getAllItemsByUser);

router.route('/:itemId').get(getItem).put(updateItem).delete(deleteItem);

router.route('/:itemId/claim').put(claimItem);

router.route('/:itemId/confirmClaim').put(confirmClaim);

router.route('/:itemId/deleteClaim').delete(deleteConfirmedItem);

module.exports = router;

