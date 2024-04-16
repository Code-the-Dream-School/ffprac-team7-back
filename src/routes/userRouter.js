const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication")

const {
  signup,
  getUserByUsername,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/userController");

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags: 
 *        - User Routes
 *     summary: Sign up into StuffFindr.
 *     description: Create a StuffFindr user account.
 *     responses:
 *       '200':
 *         description: Response after successfully creating an account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: User's username.
 *                         example: lilytest
 *                       email:
 *                         type: string
 *                         description: User's email address.
 *                         example: lilytest@test.com
 *                       location:
 *                         type: string
 *                         description: User's inputted location.
 *                         example: Los Angeles, CA
 *                       token:
 *                         type: string
 *                         description: User token created after signing up.
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjFlNWYxNjg0ZGRlZmQxNTYwZTJlMjkiLCJ1c2VybmFtZSI6Im5pbmF0ZXN0IiwiaWF0IjoxNzEzMjY2NDU1LCJleHAiOjE3MTU4NTp0NTV9.Z_XLzqwiWAFTL6It16mwDEeq1zH9NcLh8H8P15vmpL8"
*/
router.post("/signup", signup);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: 
 *        - User Routes
 *     summary: Login into a specific StuffFindr account.
 *     description: Login into a specific StuffFindr account. 
 *     responses:
 *       '200':
 *         description: Response after successfully signing in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: User's username.
 *                         example: lilytest
 *                       email:
 *                         type: string
 *                         description: User's email address.
 *                         example: lilytest@test.com
 *                       location:
 *                         type: string
 *                         description: User's inputted location.
 *                         example: Los Angeles, CA
 *                       token:
 *                         type: string
 *                         description: User token created after loggin in, which will be needed for lost items management
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjFlNWYxNjg0ZGRlZmQxNTYwZTJlMjkiLCJ1c2VybmFtZSI6Im5pbmF0ZXN0IiwiaWF0IjoxNzEzMjY2NDU1LCJleHAiOjE3MTU4NTp0NTV9.Z_XLzqwiWAFTL6It16mwDEeq1zH9NcLh8H8P15vmpL8"
*/
router.post("/login", login);

/**
 * @swagger
 * /users/:username:
 *   get:
 *     tags: 
 *        - User Routes
 *     summary: Find a StuffFindr account by username
 *     description: Find a user's StuffFindr account by using their username. 
 *     responses:
 *       '200':
 *         description: Response after successfully finding a StuffFindr user. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: User's username.
 *                         example: lilytest
 *                       email:
 *                         type: string
 *                         description: User's email address.
 *                         example: lilytest@test.com
 *                       location:
 *                         type: string
 *                         description: User's inputted location.
 *                         example: Los Angeles, CA
*/
router.put("/:userId", authenticateUser, getUserByUsername);

/**
 * @swagger
 * /users/:userId:
 *   put:
 *     tags: 
 *        - User Routes
 *     summary: Update a StuffFindr account by userId
 *     description: Make an update to a user's StuffFindr account by using their account userId. 
 *     responses:
 *       '200':
 *         description: Response after successfully updating a StuffFindr account. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "User updated successfully"
 *                       username:
 *                         type: string
 *                         description: User's username.
 *                         example: lilytest
 *                       email:
 *                         type: string
 *                         description: User's email address.
 *                         example: lilytest@test.com
 *                       location:
 *                         type: string
 *                         description: User's inputted location.
 *                         example: Miami, FL
*/
router.put("/:userId", authenticateUser, updateUser);

/**
 * @swagger
 * /users/:userId:
 *   delete:
 *     tags: 
 *        - User Routes
 *     summary: Delete a StuffFindr account by userId
 *     description: Delete a user's StuffFindr account by using their account userId. 
 *     responses:
 *       '200':
 *         description: Response after successfully deleting a StuffFindr account. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "User deleted successfully"
 *                       username:
 *                         type: string
 *                         description: User's username.
 *                         example: lilytest
 *                       email:
 *                         type: string
 *                         description: User's email address.
 *                         example: lilytest@test.com
 *                       location:
 *                         type: string
 *                         description: User's inputted location.
 *                         example: Los Angeles, CA
*/
router.delete("/:userId", authenticateUser, deleteUser);

module.exports = router;
