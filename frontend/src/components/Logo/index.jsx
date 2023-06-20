import logo from '../../assets/Logo.png'
import './index.css'

function Logo() {
    return (
        <>
            <div>
                <a href="https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_Trading_Card_Game_expansions" target="_blank">
                    <img src={logo} className="logo" alt="Pokemon TCG logo" />
                </a>
            </div>
        </>
    )
}

export default Logo
