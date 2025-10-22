import React from 'react';

export default function Pagination({ page, pages, onPage }) {
  if (!pages || pages <= 1) return null;
  const arr = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div style={{ marginTop: 20 }}>
      {arr.map(p => (
        <button key={p} onClick={() => onPage(p)} disabled={p === page} style={{ marginRight: 8 }}>
          {p}
        </button>
      ))}
    </div>
  );
}
