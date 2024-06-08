import { useEffect } from 'react'
import './startAuth.css'
import logo from '../../public/editor-hub-logo.svg'

export const StartAuth = () => {
    const client_id = import.meta.env.VITE_APP_KEY
    const redirectUrl = import.meta.env.VITE_REDIRECT_URL

    useEffect(() => {
        if (
            !client_id ||
            !redirectUrl
        ) {
            throw new Error("missing envs")
        }
    })


    const startAuth = async () => {
        try {
            const host = 'https://www.dropbox.com/oauth2/authorize'
            const params = `client_id=${client_id}&redirect_uri=${redirectUrl}&token_access_type=offline&response_type=code`

            const url = `${host}?${params}`

            window.location.href = url
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <>
        <div className='container'>
            <img className='logo' src={logo} alt="" />
            <div style={{maxWidth:'85%', padding:'0.6rem'}}>
            <div className='title'>Authorize the Editor Hub to use Dropbox Teams!</div>
            <p>• This will redirect you to Dropbox.com, where you'll have the option to authorize the Editor Hub as an allowed app.</p>
            <p>• Once authorized, the Hub will be able to operate on team files to access, create, and modify team resources.</p>
            <p>• The Hub serves as a direct channel between Dropbox and Premiere/After Effects, allowing editors to fetch resources and tools from Dropbox directly into the editing software.</p>
            </div>
            <button className='actionButton' onClick={startAuth}>
                Authorize
            </button>
        </div>
        </>
    )
}