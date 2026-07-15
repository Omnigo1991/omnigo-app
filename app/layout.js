export const metadata = {
  title: 'Omnigo – Mehr als ein Marktplatz.',
  description: 'Die Schweizer Adresse für alle, die Handel mit Stil verbinden.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de-CH">
      <body>{children}</body>
    </html>
  );
}
