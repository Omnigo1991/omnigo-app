'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { loginUser } from '../actions/auth';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '10px 12px',
  border: '1.5px solid #D2D2D7',
  borderRadius: 10,
  fontFamily: 'inherit',
  fontSize: 14,
  boxSizing: 'border-box',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        marginTop: 4,
        background: '#1FD8A4',
        color: '#1D1D1F',
        border: 'none',
        borderRadius: 999,
        padding: '12px 20px',
        fontWeight: 700,
        fontSize: 15,
        cursor: pending ? 'default' : 'pointer',
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? 'Wird geprüft …' : 'Anmelden'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginUser, {});

  return (
    <main style={{ fontFamily: FONT, maxWidth: 420, margin: '0 auto', padding: '60px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#1D1D1F' }}>Anmelden</h1>
      <p style={{ color: '#6E6E73', marginTop: 8, marginBottom: 30 }}>
        Willkommen zurück bei Omnigo.
      </p>

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          E-Mail
          <input name="email" type="email" required style={inputStyle} />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Passwort
          <input name="password" type="password" required style={inputStyle} />
        </label>

        {state?.error && (
          <p style={{ color: '#B3261E', fontSize: 13, margin: 0 }}>{state.error}</p>
        )}

        <SubmitButton />
      </form>

      <p style={{ marginTop: 20, fontSize: 13, color: '#6E6E73' }}>
        Noch kein Konto?{' '}
        <Link href="/registrieren" style={{ color: '#1D1D1F', fontWeight: 600 }}>
          Registrieren
        </Link>
      </p>
    </main>
  );
}
