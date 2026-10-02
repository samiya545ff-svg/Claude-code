export default function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="welcome">{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {children && <div className="row gap8">{children}</div>}
    </div>
  );
}
