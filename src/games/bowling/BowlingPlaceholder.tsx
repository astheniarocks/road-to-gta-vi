import { Link } from "react-router-dom";

export function BowlingPlaceholder() {
  return (
    <section className="bowling-page">
      <div className="bowling-lane" aria-hidden="true">
        <div className="bowling-pin pin-one" />
        <div className="bowling-pin pin-two" />
        <div className="bowling-pin pin-three" />
        <div className="bowling-ball" />
      </div>
      <div className="bowling-copy panel">
        <p className="page-kicker">Bowling</p>
        <h1>A future Dreamfield Industries minigame.</h1>
        <p>Coming later: timing, lane aim, ball weight, cheerful cousin pressure.</p>
        <Link className="button primary" to="/">
          Back to Timeline
        </Link>
      </div>
    </section>
  );
}
