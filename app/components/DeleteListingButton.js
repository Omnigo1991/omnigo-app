'use client';

export default function DeleteListingButton({ action }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Dieses Inserat wirklich löschen?')) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        style={{
          background: 'transparent',
          color: '#B3261E',
          border: '1.5px solid #B3261E',
          borderRadius: 999,
          padding: '9px 18px',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Löschen
      </button>
    </form>
  );
}
