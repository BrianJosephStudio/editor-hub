import express from 'express'
import bodyParser from 'body-parser';
import { addAuthorizationHeader } from '../api/dropbox';
import { createProjectFolder } from '../api/projectManager';

const router = express.Router();

router.use(addAuthorizationHeader)
router.use(bodyParser.json())

router.post("/create-project-folder", createProjectFolder)

export { router }