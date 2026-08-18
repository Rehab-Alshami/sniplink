import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Sniplink — URL Shortener & QR Codes',
  description:
    'Turn long, messy links into short, shareable URLs with instant QR codes. Track clicks from your dashboard.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#141420' },
  ],
}

// Runs synchronously while the browser parses <head>, before first paint, so
// a returning visitor's saved theme/language apply with no flash. See Next's
// "preventing flash before hydration" guide — this mirrors its cookie/
// localStorage theme example, extended to also set lang/dir for RTL.
// Keep in sync with the storage keys used in ThemeProvider/LocaleProvider.
const THEME_LOCALE_INIT_SCRIPT = `(function(){try{var r=document.documentElement;var t=localStorage.getItem("sniplink-theme");if(t==="dark")r.classList.add("dark");else if(t==="light")r.classList.add("light");var l=localStorage.getItem("sniplink-locale");if(l==="ar"){r.lang="ar";r.dir="rtl"}}catch(e){}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_LOCALE_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
