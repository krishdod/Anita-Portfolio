import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { MotionPreferenceProvider } from './hooks/useMotionPreference'
import './fonts.css'
import './index.css'
import './studio.css'
import './toolkit.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <MotionPreferenceProvider>
    <App />
  </MotionPreferenceProvider>,
)







