import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Details from "./pages/Details"
import Checkout from "./pages/Checkout"

const Layout = () => {
  return (
    <div className="max-h-screen max-w-screen w-full h-full">
      <Navbar />
      <div className="max-w-7xl p-2 mx-auto w-full h-full">

      <Outlet />
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}



export default App
