import { useEffect, useState } from "react";

export const VIEWPORT_BREAKPOINTS = {
  mobileMax: 767,
  tabletMax: 1199,
};

export const getViewport = (width) => {
  if (width <= VIEWPORT_BREAKPOINTS.mobileMax) return "mobile";
  if (width <= VIEWPORT_BREAKPOINTS.tabletMax) return "tablet";
  return "desktop";
};

const useAppViewport = () => {
  const [viewport, setViewport] = useState(() =>
    typeof window !== "undefined"
      ? getViewport(window.innerWidth)
      : "desktop",
  );

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewport(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
};

export default useAppViewport;
