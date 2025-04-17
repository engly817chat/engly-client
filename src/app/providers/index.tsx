import { Bounce, ToastContainer } from 'react-toastify'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import I18nProvider from './I18nProvider'

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition={Bounce}
      />
       <I18nProvider>
        <QueryProvider>{children}</QueryProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
