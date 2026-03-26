import note6 from '../../../../assets/note6.png';
export default function DietLayout({
  header,
  summary,
  mainLeft,
  mainRight,
  charts,
}) {
  return (
    <div className="space-y-6 flex flex-col justify-center items-center">
      {header}

      {summary}

      <div
        className="flex w-full max-w-[1280px] flex-col gap-12"
        style={{ 
            backgroundImage: `url(${note6})`, 
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            padding: '150px 150px',
            minHeight: '600px',   // Ensures the board stays large even if content is light
            minWidth: '800px',
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-start auto-rows-min">
          {mainLeft}
          {mainRight}
        </div>

        {charts}
      </div>
      
    </div>
  );
}
