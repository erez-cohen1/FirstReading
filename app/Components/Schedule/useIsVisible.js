import { useState, useEffect } from "react";

export default function useIsVisible(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    // Create an IntersectionObserver to observe the ref's visibility
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    // Start observing the element
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup the observer when the component unmounts or ref changes
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
