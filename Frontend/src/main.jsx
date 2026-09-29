import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import Providers from './app/providers'
import './pwa/installPrompt'
import './pwa/registerSW'

createRoot(document.getElementById('root')).render(
    <Providers>
        <App />
    </Providers>,
)
