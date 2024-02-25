import express from "express";
import { fetchCreditHistory } from "../controllers/credithistory.controller.js";


const router = express.Router();

router.post('/credit-history', fetchCreditHistory );

export default router