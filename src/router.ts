import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import { download, temporaryLink, getFiles, upload, getTags } from './api/dropbox'

const router = express.Router();
router.use(bodyParser.json());

router.post('/download', async (req: Request, res: Response) => {
    try {
        const { dropboxPath } = req.body;
        const result = await download(dropboxPath);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/temporary_Link', async (req: Request, res: Response) => {
    try {
        const { dropboxPath } = req.body;
        const result = await temporaryLink(dropboxPath);
        res.json({ link: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/get_files', async (req: Request, res: Response) => {
    try {
        const { dropboxPath } = req.body;
        const result = await getFiles(dropboxPath);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/upload', async (req: Request, res: Response) => {
    try {
        const { fileData, dropboxPath } = req.body;
        await upload(fileData, dropboxPath);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/get_ags', async (req: Request, res: Response) => {
    try {
        const { dropboxPaths } = req.body;
        const result = await getTags(dropboxPaths);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
