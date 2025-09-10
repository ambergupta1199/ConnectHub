//this code is for loading screen or spinner

import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    //here also for spiining icon we are choosing based on data-theme
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  );
};
export default PageLoader;