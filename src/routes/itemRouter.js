const express = require('express');
const router = express.Router()
const upload = require("../../config/multerConfig");

const {
    createItem,
    getItem,
    getAllItems,
    getAllItemsByUser,
    uploadItemImages,
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
 *            example: A green rain jacket was found in a park near Venice beach
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
 *            example: A green rain jacket was found in a park near Venice beach
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
 *     security:
 *       - bearerAuth: []
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
 *     summary: Get all the lost item entries in StuffFindr
 *     description: Find all the lost item entries in StuffFindr.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Response after successfully finding all the lost items in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
*/
router.route('/').get(getAllItems);

/**
 * @swagger
 * /items/byUser/:userId:
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
 *         description: Response after successfully finding all the lost items in the StuffFindr database posted by a specific user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
*/
router.route('/byUser/:userId').get(getAllItemsByUser);

/**
 * @swagger
 * /items/:itemId:
 *   get:
 *     tags: 
 *        - Item Routes
 *     summary: Find an item
 *     description: Find a specific lost item entry in StuffFindr by using its itemId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: The StuffFindr itemId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6625601fd050eb176b2165b4
 *     responses:
 *       '200':
 *         description: Response after successfully finding a lost item in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
*/
router.route('/:itemId').get(getItem)

/**
 * @swagger
 * /items/:itemId:/upload-item-images:
 *   post:
 *     tags: 
 *        - Item Routes
 *     summary: Upload item images
 *     description: Upload images for the item.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: The StuffFindr itemId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6625601fd050eb176b2165b4
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Item images
 *                 example: image.img
 *               userId:
 *                 type: string
 *                 description: This userId value is obtained from the token payload as req.user.userId
 *                 example: 6624306847cf7dfa1a54b917
 *     responses:
 *       '200':
 *         description: Response after successfully updating a lost item in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The images of the item have been uploaded successfully.
 *                 title:
 *                   type: string
 *                   required: true
 *                   description: Title of the lost item.
 *                   example: Rain Jacket 
 *                 description:
 *                   type: string
 *                   required: true
 *                   description: Description of the lost item.
 *                   example: A green rain jacket was found in a park near Venice beach
 *                 location:
 *                   type: string
 *                   required: true
 *                   description: Location where the item was found.
 *                   example: Miami, FL
 *                 lost:
 *                   type: boolean
 *                   required: true
 *                   description: Is the item currently lost?
 *                   example: true
 *                 itemId:
 *                   type: string
 *                   description: ItemId of the lost item in the StuffFindr database.
 *                   example: 6625601fd050eb176b2165b4
 *                 dateReported:
 *                   type: string
 *                   required: true
 *                   description: Date that the lost item was reported.
 *                   example: 2024-04-21T18:48:31.411Z
 *                 reportedBy:
 *                   type: string
 *                   required: true
 *                   description: StuffFindr userId of the user that reported the item. 
 *                   example: 6624306847cf7dfa1a54b917
 *                 images:
 *                   type: string
 *                   description: Uploaded item images 
 *                   example: image.img
*/
router.post("/:itemId/upload-item-images", upload.any(), uploadItemImages);

/**
 * @swagger
 * /items/:itemId:
 *   put:
 *     tags: 
 *        - Item Routes
 *     summary: Update an item
 *     description: Update a specific lost item entry in StuffFindr by using its itemId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: The StuffFindr itemId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6625601fd050eb176b2165b4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 description: location field with the new value
 *                 example: Miami, FL
 *     responses:
 *       '200':
 *         description: Response after successfully updating a lost item in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The item has been updated.
 *                 title:
 *                   type: string
 *                   required: true
 *                   description: Title of the lost item.
 *                   example: Rain Jacket 
 *                 description:
 *                   type: string
 *                   required: true
 *                   description: Description of the lost item.
 *                   example: A green rain jacket was found in a park near Venice beach
 *                 location:
 *                   type: string
 *                   required: true
 *                   description: Location where the item was found.
 *                   example: Miami, FL
 *                 lost:
 *                   type: boolean
 *                   required: true
 *                   description: Is the item currently lost?
 *                   example: true
 *                 itemId:
 *                   type: string
 *                   description: ItemId of the lost item in the StuffFindr database.
 *                   example: 6625601fd050eb176b2165b4
 *                 dateReported:
 *                   type: string
 *                   required: true
 *                   description: Date that the lost item was reported.
 *                   example: 2024-04-21T18:48:31.411Z
 *                 reportedBy:
 *                   type: string
 *                   required: true
 *                   description: StuffFindr userId of the user that reported the item. 
 *                   example: 6624306847cf7dfa1a54b917
*/
router.route('/:itemId').put(updateItem)

/**
 * @swagger
 * /items/:itemId:
 *   delete:
 *     tags: 
 *        - Item Routes
 *     summary: Delete an item
 *     description: Delete a specific lost item entry in StuffFindr by using its itemId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: The StuffFindr itemId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6625601fd050eb176b2165b4
 *     responses:
 *       '200':
 *         description: Response after successfully deleting a lost item in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The item has been deleted.
 *                 item:
 *                   type: object
 *                   $ref: '#/components/schemas/ItemResponse'
*/
router.route('/:itemId').delete(deleteItem);

/**
 * @swagger
 * /items/:itemId/claim:
 *   put:
 *     tags: 
 *        - Item Routes
 *     summary: Claim an item
 *     description: Claim a specific lost item in StuffFindr as yours while logged in.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: The StuffFindr itemId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6625601fd050eb176b2165b4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lost:
 *                 type: boolean
 *                 description: Whether the items is lost or not. This needs to be set to false when an item is being claimed. 
 *                 example: false
 *               claimedBy:
 *                 type: string
 *                 description: userId of the account claiming the item
 *                 example: 661e5f1684ddefd1560e2e29
 *     responses:
 *       '200':
 *         description: Response after successfully claiming a lost item in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The item has been successfully claimed.
 *                 title:
 *                   type: string
 *                   required: true
 *                   description: Title of the lost item.
 *                   example: Rain Jacket 
 *                 description:
 *                   type: string
 *                   required: true
 *                   description: Description of the lost item.
 *                   example: A green rain jacket was found in a park near Venice beach
 *                 location:
 *                   type: string
 *                   required: true
 *                   description: Location where the item was found.
 *                   example: Miami, FL
 *                 itemId:
 *                   type: string
 *                   description: ItemId of the lost item in the StuffFindr database.
 *                   example: 6625601fd050eb176b2165b4
 *                 lost:
 *                   type: boolean
 *                   example: false
 *                 claimedBy:
 *                   type: string
 *                   description: UserId of the user that claimed the item.
 *                   example: 661e5f1684ddefd1560e2e29
 *                 dateClaimed:
 *                   type: date
 *                   description: Date wwhen the user claimed the item. 
 *                   example: 2024-04-21T18:48:31.411Z
*/
router.route('/:itemId/claim').put(claimItem);

/**
 * @swagger
 * /items/:itemId/confirmClaim:
 *   put:
 *     tags: 
 *        - Item Routes
 *     summary: Confirm the claim of an item
 *     description: Allows a logged in user to confirm that the claimer's ownership of the item they have posted has been verified
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: The StuffFindr itemId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6625601fd050eb176b2165b4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claimConfirmed:
 *                 type: boolean
 *                 description: Confirmation that the claim of an item has been legitimized.
 *                 example: true
 *     responses:
 *       '200':
 *         description: Response after successfully confirming the claim of a lost item in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The claim of this item has successfully been confirmed.
 *                 title:
 *                   type: string
 *                   required: true
 *                   description: Title of the lost item.
 *                   example: Rain Jacket 
 *                 description:
 *                   type: string
 *                   required: true
 *                   description: Description of the lost item.
 *                   example: A green rain jacket was found in a park near Venice beach
 *                 location:
 *                   type: string
 *                   required: true
 *                   description: Location where the item was found.
 *                   example: Miami, FL
 *                 itemId:
 *                   type: string
 *                   description: ItemId of the lost item in the StuffFindr database.
 *                   example: 6625601fd050eb176b2165b4
 *                 lost:
 *                   type: boolean
 *                   example: false
 *                 claimedBy:
 *                   type: string
 *                   description: UserId of the user that claimed the item.
 *                   example: 661e5f1684ddefd1560e2e29
 *                 dateClaimed:
 *                   type: date
 *                   description: Date wwhen the user claimed the item. 
 *                   example: 2024-04-21T18:48:31.411Z
 *                 claimConfirmed:
 *                   type: boolean
 *                   example: true
*/
router.route('/:itemId/confirmClaim').put(confirmClaim);

/**
 * @swagger
 * /items/:itemId/deleteClaim:
 *   delete:
 *     tags: 
 *        - Item Routes
 *     summary: Delete a claimed item
 *     description: Delete an item whose claim has been confirmed to be true in StuffFindr by using its itemId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: The StuffFindr itemId, which can be obtained from the database and/or from the json response after creating the item.
 *         schema:
 *           type: string
 *         example: 6625601fd050eb176b2165b4
 *     responses:
 *       '200':
 *         description: Response after successfully deleting a claimed item in the StuffFindr database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The item has been deleted.
*/
router.route('/:itemId/deleteClaim').delete(deleteConfirmedItem);

module.exports = router;

