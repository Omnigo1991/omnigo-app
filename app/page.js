export default function HomePage() {
  return (
    <main
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textAlign: 'center',
        padding: '120px 20px',
      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 700, margin: 0, color: '#1D1D1F' }}>
        omni<span style={{ color: '#1FD8A4' }}>go</span>
      </h1>
      <p style={{ color: '#6E6E73', marginTop: '16px', fontSize: '18px' }}>
        Das technische Fundament steht. Ab hier bauen wir die echte Plattform.
      </p>
    </main>
  );
}
