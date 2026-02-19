import { Component, type ReactNode, Suspense } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import GlobalLayout from '@/components/GlobalLayout'
import './App.css'

type RouteErrorBoundaryProps = {
  pathName: string
  children: ReactNode
}

type RouteErrorBoundaryState = {
  error?: unknown
}

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = {}

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  componentDidCatch(error: unknown) {
    console.error('[RouteErrorBoundary] route crashed', { pathName: this.props.pathName, error })
  }

  render() {
    if (this.state.error) {
      return (
        <GlobalLayout>
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-xl border border-dashed p-6 space-y-2">
              <h1 className="text-xl font-bold">頁面發生錯誤</h1>
              <p className="text-sm text-muted-foreground">此頁面無法正常顯示，請打開瀏覽器 Console 檢查錯誤日誌。</p>
              <p className="text-xs text-muted-foreground">路徑：{this.props.pathName}</p>
            </div>
          </div>
        </GlobalLayout>
      )
    }

    return this.props.children
  }
}

function App() {
  const location = useLocation()
  const element = useRoutes(routes)

  if (!element) {
    console.warn('[Router] no route matched', { pathName: location.pathname })
    return (
      <GlobalLayout>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-xl border border-dashed p-6 space-y-2">
            <h1 className="text-xl font-bold">找不到此頁面</h1>
            <p className="text-sm text-muted-foreground">此連結可能已失效，或路由尚未載入。</p>
            <p className="text-xs text-muted-foreground">路徑：{location.pathname}</p>
          </div>
        </div>
      </GlobalLayout>
    )
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RouteErrorBoundary pathName={location.pathname}>{element}</RouteErrorBoundary>
    </Suspense>
  )
}

export default App
