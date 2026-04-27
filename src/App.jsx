import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthApp from './apps/AuthApp'
import AdminApp from './apps/AdminApp'
import DriverApp from './apps/DriverApp'
import RiderApp from './apps/RiderApp'

export default function App(){
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<AuthApp/>}></Route>
                <Route path="/rider/*" element={<RiderApp />} />
                <Route path="/driver/*" element={<DriverApp />} />
                <Route path="/admin/*" element={<AdminApp />} />
            </Routes>
        </>
    )
}