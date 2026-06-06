import '../Home.css'
import realmBanner from '../assets/realm-banner.png'
import wealthImg from '../assets/wealth.png'
import relicsImg from '../assets/relics.png'
import loreImg from '../assets/lore.png'
import legacyImg from '../assets/legacy.png'
import fortuneImg from '../assets/fortune.png'
import kingImg from '../assets/king.png'
import blazeImg from '../assets/blaze.png'
import ghostImg from '../assets/ghost.png'
import sentinelImg from '../assets/sentinel.png'

function Home() {
  return (
    <div>
      <section
        className="hero"
        style={{
          backgroundImage: `url(${realmBanner})`
        }}
      />

      <section className="content">
        <div className="section-divider"></div>

        <h2 className="legend-title">THE LEGEND BEGINS</h2>

        <p>
          The Realm is a persistent fantasy world where every Wanderer
          chooses their own journey.
        </p>

        <p>
          Long before the First Wanderer entered The Realm, a King vanished without a trace. His throne remains empty. His treasures remain hidden. His story remains unfinished.
        </p>

        <p>
          Across the world, relics of forgotten ages lie waiting to be discovered. Ancient orders pursue ther own ambitions. Whispers speak of figures whose names have become legend.
          <br />
          <br />
          Some Wanderers seek wealth and fortune. Some seek knowledge. Others...seek power. And still others...simply want answers.
        </p>

        <p>
          Every Wanderer enters The Realm with nothing. What they become is entirely their own choice.
        </p>


        <div className="section-divider"></div>

        <h2 className="legend-title">THE FIVE DESTINIES</h2>

        <div className="pursuit-grid">

          <div className="pursuit-card">
            <img
                src={wealthImg}
                alt="Wealth"
                className="pursuit-icon"
              />
            <h3>WEALTH</h3>
            <p>
              Build your fortune in Ghost Coins and uncover new
              opportunities for prosperity.
            </p>
          </div>

          <div className="pursuit-card">
            <img
                src={relicsImg}
                alt="Relics"
                className="pursuit-icon"
              />
            <h3>RELICS</h3>
            <p>
              Collect rare relics, artifacts, treasures, and complete
              prestigious collections.
            </p>
          </div>

          <div className="pursuit-card">
            <img
                src={loreImg}
                alt="Lore"
                className="pursuit-icon"
              />
            <h3>LORE</h3>
            <p>
              Discover the history of The Realm and uncover the secrets
              of legendary figures.
            </p>
          </div>

          <div className="pursuit-card">
            <img
                src={legacyImg}
                alt="Legacy"
                className="pursuit-icon"
              />
            <h3>LEGACY</h3>
            <p>
              Earn titles, achievements, reputation, influence,
              and recognition.
            </p>
          </div>

          <div className="pursuit-card">
            <img
                src={fortuneImg}
                alt="Fortune"
                className="pursuit-icon"
              />
            <h3>FORTUNE</h3>
            <p>
              Challenge fate through games, events, risks,
              and rewards.
            </p>
          </div>

        </div>

        <div className="section-divider"></div>

        <h2 className="legend-title">
          LEGENDS OF THE REALM
        </h2>

        <div className="legends-grid">

        <div className="legend-card">
            <img
                src={kingImg}
                alt="Forgotten King"
                className="legend-icon"
            />
            <h3>Forgotten King</h3>
            <p>
            His throne remains empty.
            His fate remains unknown.
            </p>
        </div>

        <div className="legend-card">
            <img
                src={blazeImg}
                alt="Blaze Mortem"
                className="legend-icon"
            />
            <h3>Blaze Mortem</h3>
            <p>
            Master of Risk, Fortune, and Flame.
            </p> 
        </div>

        <div className="legend-card">
            <img
                src={ghostImg}
                alt="The Ghost"
                className="legend-icon"
            />
            <h3>The Ghost</h3>
            <p>
            Some claim to have seen him.
            Others deny he ever existed.
            </p>
        </div>

        <div className="legend-card">
            <img
                src={sentinelImg}
                alt="The Sentinel"
                className="legend-icon"
            />
            <h3>The Sentinel</h3>
            <p>
            Eternal guardian of forgotten places
            and ancient secrets.
            </p>
        </div>

        </div>

        <h2 className="legend-title">THE EVER-EVOLVING WORLD</h2>

        <p>
          The Realm is never truly complete.
        </p>

        <p>
          New relics are discovered.
        </p>

        <p>
          Ancient secrets are uncovered.
        </p>

        <p>
          New opportunities emerge.
        </p>

        <p>
          New stories are written.
        </p>

        <p>
          The Realm evolves with every passing age.
        </p>

        <div className="section-divider"></div>

        <h2 className="legend-title">YOUR JOURNEY BEGINS HERE</h2>

        <p>
          Every Wanderer enters The Realm with nothing.
        </p>

        <p>
          What happens next is entirely up to you.
        </p>

        <div className="section-divider"></div>

        <div className="enter-realm-container">
          <button className="enter-realm-button">
            Enter The Realm
          </button>
        </div>

      </section>
    </div>
  )
}

export default Home