export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
      Product {params.id}
    </div>
  );
}
