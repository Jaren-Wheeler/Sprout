import { useEffect, useRef, useState } from "react";

export default function SproutingAnimation() {
  const ref = useRef();
  const [grow, setGrow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrow(false);
          requestAnimationFrame(() => setGrow(true));
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex justify-center items-center">

      <svg
        className={`flower ${grow ? "grow" : ""}`}
        width="220"
        height="260"
        viewBox="0 0 220 260"
      >

        {/* soil */}
        <ellipse cx="110" cy="240" rx="90" ry="25" fill="#6b3e17" />

        {/* stem */}
        <path
          className="stem"
          d="M110 235 C110 180 110 160 110 120"
          stroke="#2f9e44"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* leaves */}
        <ellipse className="leaf leaf1" cx="95" cy="170" rx="22" ry="12" fill="#40c057"/>
        <ellipse className="leaf leaf2" cx="125" cy="155" rx="22" ry="12" fill="#37b24d"/>

        {/* flower petals */}
        <circle className="petal p1" cx="110" cy="110" r="14" fill="#ff6b6b"/>
        <circle className="petal p2" cx="92" cy="110" r="14" fill="#ffa94d"/>
        <circle className="petal p3" cx="128" cy="110" r="14" fill="#ffd43b"/>
        <circle className="petal p4" cx="110" cy="92" r="14" fill="#f783ac"/>

        {/* flower center */}
        <circle className="center" cx="110" cy="110" r="10" fill="#fab005"/>

        {/* sparkles */}
        <circle className="spark s1" cx="80" cy="80" r="3"/>
        <circle className="spark s2" cx="140" cy="70" r="3"/>
        <circle className="spark s3" cx="160" cy="120" r="3"/>
        <circle className="spark s4" cx="70" cy="120" r="3"/>

      </svg>
    </div>
  );
}