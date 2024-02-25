import express from "express";
import {getIdentityData} from '../controllers/identity.controller.js'


const router = express.Router();

router.get('/identity/:id', getIdentityData );

export default router