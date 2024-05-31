import express from 'express'
import bodyParser from 'body-parser';
import { addAuthorizationHeader, createProjectFolder } from '../api/dropbox';

const router = express.Router();

router.use(addAuthorizationHeader)
router.use(bodyParser.json())

router.post("/create-project-folder", createProjectFolder)

export { router }