export default function DietLayout({
  header,
  summary,
  mainLeft,
  mainRight,
  charts,
}) {
  return (
    <div className="space-y-6">
      {header}

      {summary}

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        <div className="space-y-6">{mainLeft}</div>

        <div className="space-y-6">{mainRight}</div>
      </div>

      {charts}
    </div>
  );
}
