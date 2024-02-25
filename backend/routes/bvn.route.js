import express from "express";
import { initiateBVN,verifyBVN, fetchBVN, initiateBankAccounts, fetchBankAccounts } from "../controllers/bvn.controller.js";

const router = express.Router();

router.post('/initiate', initiateBVN)

router.post('/verify',verifyBVN )

router.post('/details', fetchBVN)

router.post('/bank-accounts-fetch', initiateBankAccounts )

router.post('/bank-accounts-detail', fetchBankAccounts )


export default router