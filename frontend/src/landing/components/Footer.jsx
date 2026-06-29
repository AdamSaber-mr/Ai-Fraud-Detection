import { Reveal } from '../anim'

export default function Footer({ onTry, onBrand }) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <Reveal as="div" className="foot-inner">
        <div className="foot-brand">
          <button className="foot-logo" onClick={onBrand}>Sentinel</button>
          <p className="foot-tag">
            AI-fraudedetectie die leert wat normaal is en het afwijkende
            naar boven brengt.
          </p>
        </div>

        <nav className="foot-nav" aria-label="Footer">
          <a href="#cijfers">Cijfers</a>
          <a href="#model">Het model</a>
          <a href="#signalen">Signalen</a>
          <button className="foot-link" onClick={onTry}>Dashboard</button>
        </nav>
      </Reveal>

      <div className="foot-bottom">
        <span>Isolation Forest · scikit-learn · React</span>
        <span>© {year} Adam Saber · Prototype</span>
      </div>
    </footer>
  )
}
