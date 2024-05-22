import express, { Request, Response } from 'express'
import { dropboxApiProxy, dropboxContentProxy, addAuthorizationHeader } from './api/dropbox'

const router = express.Router();

router.use(addAuthorizationHeader)

router.post('/download', await dropboxContentProxy());

router.post('/get_temporary_link', await dropboxApiProxy());

router.post('/list_folder', await dropboxApiProxy());

router.post('/upload', await dropboxContentProxy());

router.post('/tags/get', await dropboxApiProxy());

export { router }
