import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'IBM Plex Sans Thai, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
