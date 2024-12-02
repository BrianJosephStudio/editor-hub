import express, { Request, Response } from 'express'
import { dropboxFilesProxy, dropboxContentProxy, addAuthorizationHeader, dropboxFilePropertiesProxy } from '../../../api/dropbox'

const router = express.Router();

router.use(addAuthorizationHeader)

router.post('/download', await dropboxContentProxy());

router.post('/move_batch_v2', await dropboxFilesProxy());

router.post('/move_batch/check_v2', await dropboxFilesProxy());

router.post('/get_temporary_link', await dropboxFilesProxy());

router.post('/list_folder', await dropboxFilesProxy());

router.post('/list_folder/continue', await dropboxFilesProxy());

router.post('/upload', await dropboxContentProxy());

router.post('/tags/get', await dropboxFilesProxy());

router.post('/get_metadata', await dropboxFilesProxy());

router.post('/properties/add', await dropboxFilePropertiesProxy());

router.post('/properties/update', await dropboxFilePropertiesProxy());

export { router }
