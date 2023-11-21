import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import './index.css'
import NavigationContextProvider from './context/NavigationContext.tsx'
import CallListContextProvider from './context/CallListContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <NavigationContextProvider excludeInvalidActivities={false}>
        <CallListContextProvider>
          <App />
        </CallListContextProvider>
      </NavigationContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
