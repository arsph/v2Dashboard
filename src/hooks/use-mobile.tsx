
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Default to false
  const [hasMounted, setHasMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasMounted(true);
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Check initial value after mount
    onChange(); // Call it once to set initial state based on current window size

    mql.addEventListener("change", onChange);
    
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  // Only return the true mobile status once mounted and calculated, otherwise default to false.
  // This ensures server-render and initial client-render are consistent.
  return hasMounted ? isMobile : false;
}
