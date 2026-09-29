import { Toaster } from "react-hot-toast";
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
