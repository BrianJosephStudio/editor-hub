import express, { Request, Response } from 'express'
import { GenericTags, AgentTags, MapTags, privateTags } from '../../resources/TagSystem';

const router = express.Router();

router.get('/tag-system', (req: Request, res: Response) => {
    res.json({ GenericTags, AgentTags, MapTags, privateTags})
});

export { router }
