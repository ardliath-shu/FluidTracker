import Card from "./Card";

export default function StatsTrends({ userId, patient }) {
  const isSelf = Number(patient.userId) === Number(userId);
  const total = Math.round(patient.totalToday);
  const target = patient.fluidTarget;
  const typical = patient.typicalProgress?.[0] || {};
  const avg = Math.round(typical.average || 0);
  const min = Math.round(typical.min || 0);
  const max = Math.round(typical.max || 0);
  const percent = target
    ? Math.min(100, Math.round((total / target) * 100))
    : 0;

  return (
    <Card
      title="Stats and Daily Trend"
      icon="fa-percent"
      colour="orange"
      collapsible={true}
      defaultOpen={false}
    >
      <ul className="trends-list">
        <li>
          <strong>{isSelf ? "You have" : `${patient.firstName} has`}</strong>{" "}
          consumed <span className="highlight">{total}ml</span> of{" "}
          <span className="highlight">{target}ml</span>.
        </li>

        <li className="progress-row">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${percent}%` }} />
          </div>
          <span className="percent">{percent}% of target</span>
        </li>

        <li>
          Typical by now: <span className="highlight">{avg}ml</span>
          <br /> (Range {min}–{max}ml)
        </li>
      </ul>
    </Card>
  );
}
