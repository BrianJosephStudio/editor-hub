import axios from 'axios'
import express, { Request, Response } from 'express'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const { EDITOR_HUB_APP_KEY, EDITOR_HUB_APP_SECRET, REDIRECT_URL  } = process.env


const router = express.Router();


router.get('/redirect', async (req: Request, res: Response) => {
    try {
        console.log(req.query)
        const now = Date.now()
        const authCodeFolder = path.resolve(__dirname, "..", "..", "..", "authCode")

        await mkdir(authCodeFolder, { recursive: true });

        await writeFile(
            path.resolve(authCodeFolder, `auth_code_${now}.json`),
            JSON.stringify(req.query, null, 2)
        )

        const authorization_code = req.query.code

        const body = {
            code: authorization_code,
            grant_type: 'authorization_code',
            client_id: EDITOR_HUB_APP_KEY,
            client_secret: EDITOR_HUB_APP_SECRET,
            redirect_uri: REDIRECT_URL
        }

        const host = 'https://api.dropbox.com/oauth2/token'
        //@ts-ignore
        const params = new URLSearchParams(body).toString()
        const url = `${host}?${params}`

        const { data } = await axios.post(url, body)

        console.log("data", data)

        await writeFile(
            path.resolve(authCodeFolder, `token_${now}.json`),
            JSON.stringify(data, null, 2)
        )

        res.redirect(
            '/authorization/finish'
        )
    } catch (e) {
        console.error(e)
    }
});

router.use(express.static(path.resolve(__dirname, "..", "..", "..", "apps", "authorization", "dist")))

router.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "..", "..", "apps", "authorization", "dist", "index.html"));
});

export { router }