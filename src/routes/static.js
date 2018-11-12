const express = require( "express" );
const router = express.Router();
const staticController = require( "../controllers/staticController.js" );

router.get( "/", staticController.index );

router.get( "/marco", ( req, res, next ) => {
  res.send( "POLO!" );
} );

module.exports = router;
