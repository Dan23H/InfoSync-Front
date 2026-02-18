import { createRoot } from 'react-dom/client'
import AppRouter from "./router/AppRouter"
import { AuthProvider } from './context/AuthContext'
import { PlanProvider } from './context/PlanContext'
import { PostModalProvider } from './context/PostModalContext'
import SocketContextComponent from './components/apps/socket/Socket'

createRoot(document.getElementById('root')!).render(
  <SocketContextComponent>
    <AuthProvider>
      <PlanProvider>
        <PostModalProvider>
          <main role="main">
            <AppRouter />
          </main>
        </PostModalProvider>
      </PlanProvider>
    </AuthProvider>
  </SocketContextComponent>
)
