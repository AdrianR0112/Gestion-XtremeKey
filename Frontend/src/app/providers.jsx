import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TooltipProvider } from "../components/ui/tooltip";
import { queryClient } from "./query-client";
import { store } from "./store";

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <TooltipProvider>{children}</TooltipProvider>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
