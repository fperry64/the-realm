import '../MoonDruids.css'
import moonBanner from '../assets/moon-druids-banner.png'

function Moons() {

    return (

        <div className="moon-page">

            <img
                src={moonBanner}
                alt="Moon Druids"
                className="moon-banner"
            />

            <div className="moon-content">

                <h1>
                    THE MOON DRUIDS
                </h1>

                <p className="moon-intro">

                    Beneath silver skies and hidden among
                    ancient forests dwell the Moon Druids,
                    one of the oldest surviving orders in
                    The Realm.

                </p>

                <p>

                    Long before kings claimed thrones and
                    before great cities rose from stone,
                    the Moon Druids studied the celestial
                    cycles that governed the world. Their
                    wisdom was recorded beneath moonlit
                    groves, hidden from those who sought
                    power without understanding.

                </p>

                <p>

                    The Druids do not serve kingdoms,
                    rulers, or armies. Their loyalty
                    belongs to the balance of The Realm
                    itself. They observe, remember, and
                    protect knowledge that many believe
                    has been lost forever.

                </p>

                <p>

                    Few travelers are ever granted access
                    to their sacred circles. Fewer still
                    leave with the secrets they sought.

                </p>

                <p>

                    The Moon Druids preserve knowledge hidden from the rest of The Realm.
                    Future discoveries associated with the Moon Druids will appear within
                    these archives.

                </p>

            </div>

        </div>

    )

}

export default Moons