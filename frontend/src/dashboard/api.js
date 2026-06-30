import axios from 'axios'
import demoResponse from './demoData.json'

// Praat met de Flask-backend (lokaal geproxied via vite.config.js -> :5001).
//
// Op de GitHub Pages-versie is er GEEN backend (Pages serveert alleen statische
// bestanden). Dan zetten we VITE_STATIC_DEMO aan tijdens de build: "Demo data"
// gebruikt dan een vooraf opgeslagen, echt backend-antwoord (demoData.json), zodat
// het dashboard volledig werkt. CSV-upload heeft de Python-backend nodig en kan
// daar dus niet — die toont een nette melding.
const STATIC = import.meta.env.VITE_STATIC_DEMO === 'true'

export const loadDemoData = () => {
  if (STATIC) return Promise.resolve({ data: demoResponse })
  return axios.get('/api/demo')
}

export const uploadCSV = (file) => {
  if (STATIC) {
    return Promise.reject(
      new Error(
        'CSV-upload werkt alleen in de lokale versie met de Python-backend. ' +
          'Gebruik “Demo data” om het volledige dashboard te bekijken.',
      ),
    )
  }
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/upload', formData)
}
