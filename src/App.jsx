import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthApp from './apps/AuthApp'
import AdminApp from './apps/AdminApp'
import DriverDashboard from './apps/DriverApp'
import RiderApp from './apps/RiderApp'

export default function App(){
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<AuthApp/>}></Route>
                <Route path="/rider/*" element={<RiderApp />} />
                <Route path="/driver/*" element={<DriverDashboard />} />
                <Route path="/admin/*" element={<AdminApp />} />
            </Routes>
        </>
    )
}