import { Toaster } from "react-hot-toast";
import AppRouter from "./app/router";

const App = () => {
    return (
        <>
            <Toaster />
            <AppRouter />
        </>
    );
};

export default App;
