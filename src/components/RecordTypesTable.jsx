import { T } from '../theme';

export default function RecordTypesTable() {
  const records = [
    { type: 'A', desc: 'Maps a hostname to an IPv4 address.' },
    { type: 'AAAA', desc: 'Maps a hostname to an IPv6 address.' },
    { type: 'CNAME', desc: 'Alias of one name to another.' },
    { type: 'MX', desc: 'Directs mail to an email server.' },
    { type: 'TXT', desc: 'Holds arbitrary text (often for SPF/DKIM).' },
    { type: 'NS', desc: 'Delegates a DNS zone to an authoritative server.' }
  ];

  return (
    <div style={{ overflowX: 'auto', margin: '32px 0' }}>
      <table style={{
        width: '100%',
        minWidth: '500px',
        borderCollapse: 'collapse',
        textAlign: 'left'
      }}>
        <thead>
          <tr style={{ background: T.surface, borderBottom: `2px solid ${T.borderMid}` }}>
            <th style={{ padding: '16px', fontFamily: 'Poppins', fontWeight: 600, color: T.text }}>Record Type</th>
            <th style={{ padding: '16px', fontFamily: 'Poppins', fontWeight: 600, color: T.text }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r.type} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td style={{ padding: '16px', fontFamily: 'Roboto Mono', color: T.accent, fontSize: '0.9rem' }}>{r.type}</td>
              <td style={{ padding: '16px', color: T.muted, fontSize: '0.95rem' }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
