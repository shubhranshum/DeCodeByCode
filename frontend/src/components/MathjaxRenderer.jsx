// MathjaxRenderer.jsx
import { useEffect, useRef } from "react";

export default function MathjaxRenderer({ html }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([contentRef.current]);
    }
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="prose max-w-none text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
