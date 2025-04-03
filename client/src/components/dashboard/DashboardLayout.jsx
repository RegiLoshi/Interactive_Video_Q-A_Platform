import { Outlet } from "react-router-dom"
import Navbar from "./Navbar";
import Footer from "./Footer";

const DashboardLayout = () => {
    return(
        <div className="flex flex-col w-full min-h-screen">
            <Navbar />
            <main className="flex-1 pt-4 mt-2">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default DashboardLayout;