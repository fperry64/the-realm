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

                <div className="moon-section">

                    <h2>
                        Known Relics
                    </h2>

                    <p>
                        No associated relics have yet been
                        identified.
                    </p>

                </div>

                <div className="moon-section">

                    <h2>
                        Known Members
                    </h2>

                    <p>
                        The identities of the Moon Druids
                        remain hidden.
                    </p>

                </div>

                <div className="moon-section">

                    <h2>
                        Additional Secrets
                    </h2>

                    <p>

                        Continue exploring the Hall of
                        Forgotten Lore to uncover more
                        knowledge concerning the Moon
                        Druids.

                    </p>

                </div>

            </div>

        </div>

    )

}

export default Moons