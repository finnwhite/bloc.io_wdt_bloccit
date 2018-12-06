const express = require( "express" );
const router = express.Router();
const userController = require( "../controllers/userController.js" );
const validation = require( "./validation.js" );

const base = "/users";

router.get( `${ base }/sign_up`,
  userController.signUp );
router.post( base,
  validation.validateUsers,
  userController.create );

router.get( `${ base }/sign_in`,
  userController.signInForm );
router.post( `${ base }/sign_in`,
  validation.validateUsers,
  userController.signIn );

router.get( `${ base }/sign_out`,
  userController.signOut );

router.get( `${ base }/:id`,
  userController.show );

module.exports = router;
