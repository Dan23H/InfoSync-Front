import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from "./router/AppRouter"
import { AuthProvider } from './context/AuthContext'
import { PlanProvider } from './context/PlanContext'
import { PostModalProvider } from './context/PostModalContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PlanProvider>
        <PostModalProvider>
          <AppRouter />
        </PostModalProvider>
      </PlanProvider>
    </AuthProvider>
  </StrictMode>,
)
