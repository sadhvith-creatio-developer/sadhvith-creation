import { useEffect } from "react";
import { config } from "../config";

// Sets the browser tab title for a page, e.g. "Premium Wooden Name Plate | Sadhvith Creation"
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${config.brandName}` : config.brandName;
  }, [title]);
}
