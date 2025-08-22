function MyInformation({
  id,
  name,
  email,
}: {
  id: string;
  name: string;
  email?: string;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h4 style={{ color: "var(--primary-purple)", marginBottom: "var(--spacing-3)" }}>
          {name}
        </h4>
        {email ? (
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-2)" }}>
            📧 {email}
          </p>
        ) : (
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-2)" }}>
            📧 No email provided
          </p>
        )}
        <div className="badge badge-info">
          ID: {id.slice(-6)}
        </div>
      </div>
    </div>
  );
}

export default MyInformation;
