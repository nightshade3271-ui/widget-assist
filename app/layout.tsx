import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WidgetAssist - Chat Bot Engine',
  description: 'Create intelligent AI chat widgets for your website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&family=Yeseva+One&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
