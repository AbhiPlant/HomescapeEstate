import express from 'express';
import { createListing, updateListing, getListing, deleteListing, getListings } from '../controllers/listingControl.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/get', getListings);



export default router;