import './globals.css'

export const metadata = {
  title: 'المنهج السوداني التفاعلي',
  description: 'منصة تعليمية تفاعلية مجانية للمنهج السوداني - معامل افتراضية ومحاكاة تفاعلية للكيمياء والفيزياء والرياضيات والأحياء',
  keywords: 'منهج سوداني, تعليم, معمل افتراضي, كيمياء, فيزياء, رياضيات, أحياء, السودان',
  openGraph: {
    title: 'المنهج السوداني التفاعلي',
    description: 'تعلّم بالتجربة بدل الحفظ! منصة تعليمية تفاعلية مجانية لطلاب السودان',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3a5f" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇸🇩</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
