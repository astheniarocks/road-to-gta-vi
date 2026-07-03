import { Link } from "react-router-dom";

export function GamesPage() {
  return (
    <section className="games-page">
      <header className="page-header">
        <p className="page-kicker">Dreamfield Industries Minigames</p>
        <h1 className="page-title">Small web toys and fan-made interactive experiments.</h1>
      </header>
      <div className="game-grid">
        <article className="game-card">
          <p className="game-card-kicker">Placeholder</p>
          <h2>Bowling</h2>
          <p>A future Dreamfield Industries minigame.</p>
          <Link className="button" to="/games/bowling">
            Open Bowling
          </Link>
        </article>
      </div>
    </section>
  );
}
