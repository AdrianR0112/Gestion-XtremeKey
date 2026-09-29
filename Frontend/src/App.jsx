import { Toaster } from "@/components/ui/sonner";
import AppRouter from "./app/router";
import PushSubscriptionSync from "./modules/notificaciones/components/PushSubscriptionSync";

const App = () => {
    return (
        <>
            <Toaster />
            <PushSubscriptionSync />
            <AppRouter />
        </>
    );
};

export default App;
