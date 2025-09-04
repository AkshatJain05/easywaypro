import { useEffect, useState } from "react";

const words = ["Easyway Pro","Easyway AI","Easyway Classes"];

export default function TypingMotion() {
  const [index, setIndex] = useState(0); // which word
  const [subIndex, setSubIndex] = useState(0); // letter index
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index === words.length) return;

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 120);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  useEffect(() => {
    if (index === words.length) return;

    if (!reverse && subIndex === words[index].length + 1) {
      setTimeout(() => setReverse(true), 1000);
    } else if (reverse && subIndex === 0) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
    }
  }, [subIndex, index, reverse]);

  useEffect(() => {
    const timeout2 = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(timeout2);
  }, []);

  return (
    <span
      className="
        inline-block 
        min-h-[1em]     /* reserve height to avoid cut-off */
        font-bold 
        bg-clip-text text-transparent 
        bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600
        pt-2 md:pt-0.5
      "
    >
      {`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}
    </span>
  );
}
