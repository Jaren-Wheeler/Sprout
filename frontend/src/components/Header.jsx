import logo from "../assets/Logo.png"; // Import your logo
export default function Header({ title, onMenuClick }) {
  return (
    <header className="flex items-center p-0"> 
      <button onClick={onMenuClick} className="w-32 h-24 transition-transform hover:scale-105 ml-6">
        <img 
          src={logo} 
          alt="Menu" 
          // 'w-full h-full' makes the image fill the button size
          className="w-full h-full object-contain cursor-pointer" 
        />
      </button>

      <h1>{title}</h1>
    </header>
  );
}