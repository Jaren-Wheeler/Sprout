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
        className="flex flex-col gap-12 w-[120%]"
        style={{ 
            backgroundImage: `url(${note6})`, 
            backgroundSize: '110% 110%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            padding: '150px 200px', // Adjusted padding to let items sit closer to the edges
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
