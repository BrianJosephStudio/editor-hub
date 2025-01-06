import { Response, Request, NextFunction } from 'express'
export const checkEnvs = (_req: Request, res: Response, next: NextFunction) => {
    const {
        EDITOR_HUB_APP_KEY,
        EDITOR_HUB_APP_SECRET
    } = process.env
    if (
        !EDITOR_HUB_APP_KEY ||
        !EDITOR_HUB_APP_SECRET
    ) {
        res.status(500).json({
            message: "An internal server error occured"
        })
        throw new Error('Missing envs')
    }
    next()
} 