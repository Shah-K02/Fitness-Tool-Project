const LogEntry = ({ entry, formatHour }) => {
  const hourString = formatHour(entry.log_time.getHours());

  return (
    <div className="log-entry">
      <div className="log-entry-time">{hourString}</div>
      <div className="log-entry-description">{entry.description}</div>
    </div>
  );
};

export default LogEntry;
