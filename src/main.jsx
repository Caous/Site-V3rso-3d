import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { Nav, Preloader, ZRuler, useThemeWatcher } from './components/Chrome'
import Hero from './sections/Hero'
import Slice from './sections/Slice'
import Print from './sections/Print'
import { Pieces, Statement } from './sections/Pieces'
import Printer from './sections/Printer'
import Process from './sections/Process'
import Colors from './sections/Colors'
import Scale from './sections/Scale'
import Closing from './sections/Closing'
import { ScrollTrigger, initScroll } from './lib/scroll'

function App() {
  useEffect(() => {
    initScroll()
    // As alturas dos trilhos dependem da fonte carregada.
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])
  useThemeWatcher()
  return (
    <>
      <Preloader assets={['/img/gato.webp', '/frames/printer/f_0001.webp']} />
      <Nav />
      <ZRuler />
      <main>
        <Hero />
        <Slice />
        <Print />
        <Statement />
        <Pieces />
        <Printer />
        <Process />
        <Colors />
        <Scale />
        <Closing />
      </main>
    </>
  )
}

document.body.dataset.theme = 'dark'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
