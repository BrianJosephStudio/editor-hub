import express, { Request, Response } from 'express'
import { dropboxFilesProxy, dropboxContentProxy, addAuthorizationHeader, dropboxFilePropertiesProxy, dropboxSharingProxy } from '../../../api/dropbox'

const router = express.Router();

router.use(addAuthorizationHeader)

router.post('/download', await dropboxContentProxy());

router.post('/move_batch_v2', await dropboxFilesProxy());

router.post('/move_batch/check_v2', await dropboxFilesProxy());

router.post('/get_temporary_link', await dropboxFilesProxy());

router.post('/list_folder', await dropboxFilesProxy());

router.post('/list_folder/continue', await dropboxFilesProxy());

router.post('/create_shared_link_with_settings', await dropboxSharingProxy());

router.post('/upload', await dropboxContentProxy());

router.post('/tags/get', await dropboxFilesProxy());

router.post('/get_metadata', await dropboxFilesProxy());

router.post('/properties/add', await dropboxFilePropertiesProxy());

router.post('/properties/remove', await dropboxFilePropertiesProxy());

router.post('/properties/update', await dropboxFilePropertiesProxy());

router.post('/upload_session/start_batch', await dropboxFilesProxy());

router.post('/upload_session/append_v2', await dropboxContentProxy());

router.post('/upload_session/finish_batch/check', await dropboxFilesProxy());

router.post('/upload_session/finish_batch', await dropboxFilesProxy());


export { router }
