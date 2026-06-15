import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TooltipProvider } from "../components/ui/tooltip";
import { store } from "./store";

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <TooltipProvider>{children}</TooltipProvider>
      </Provider>
    </BrowserRouter>
  );
}
