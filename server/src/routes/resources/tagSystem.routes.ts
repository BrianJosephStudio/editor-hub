import express, { Request, Response } from 'express'
import { GenericTags, AgentTags, MapTags, privateTags } from '@editor-hub/tag-system';

const router = express.Router();

router.get('/tag-system', (req: Request, res: Response) => {
    res.json({ GenericTags, AgentTags, MapTags, privateTags})
});

export { router }
