import { Route, Routes } from "react-router"
import Nav from "./components/Nav"
import Footer from "./components/Footer"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Panel from "./pages/Panel"
import Protect from "./components/utils/Protect"
import Catalog from "./pages/Catalog"
import Home from "./pages/Home"
import LaptopDetail from "./pages/LaptopDetail"

import { ToastContainer } from 'react-toastify';

function App() {


  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/laptops" element={<Catalog />} />
        <Route path="/laptops/:id" element={<LaptopDetail />} />
        <Route path="/panel" element={<Protect><Panel/></Protect>} />
      </Routes>
      
      <Footer />
        
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
