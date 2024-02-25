import express from "express"
import { accountNumberLookup, bankLookup } from "../controllers/account.controller.js";


const router = express.Router();

router.get('/bank-list', bankLookup );
router.post('/account-number', accountNumberLookup );

export default router