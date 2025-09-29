export default function CardComponent({ title, icon, colour, children }) {
  return (
    <div className={`card ${colour}`}>
      <div className="card-header">
        <i className={`fa ${icon}`}></i> {title}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
