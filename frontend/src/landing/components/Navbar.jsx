import { useEffect, useState } from 'react'

export default function Navbar({ onTry, onBrand }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '')}>
      <a
        className="brand"
        href="#top"
        onClick={(e) => { e.preventDefault(); onBrand() }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9.2" stroke="#b9a3f0" strokeWidth="1.4" opacity="0.5" />
          <path d="M11 11 L18 7" stroke="#b9a3f0" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="11" cy="11" r="2" fill="#b9a3f0" />
        </svg>
        Sentinel
      </a>

      <nav className="links">
        <a href="#cijfers">Cijfers</a>
        <a href="#model">Hoe het werkt</a>
        <a href="#signalen">Signalen</a>
      </nav>

      <span className="spacer" />

      <button className="cta" onClick={onTry}>Probeer het uit</button>
    </header>
  )
}
