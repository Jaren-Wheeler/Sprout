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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start auto-rows-min">
        {mainLeft}
        {mainRight}
      </div>

      {charts}
    </div>
  );
}
