import './startAuth.css'
import logo from '../../public/editor-hub-logo.svg'

export const Redirect = () => {
    return (
        <>
            <div className='container'>
                <img className='logo' src={logo} alt="" />
                <div style={{ maxWidth: '85%', padding: '0.6rem' }}>
                    <img 
                    style={{maxHeight:'4rem'}}
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Eo_circle_green_white_checkmark.svg/640px-Eo_circle_green_white_checkmark.svg.png" alt="Woo hoo!" />
                    <p>It's done! No further steps are required.</p>
                </div>
            </div>
        </>
    )
}