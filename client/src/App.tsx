import { BrowserRouter, Routes, Route, Outlet, createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Details from "./pages/Details"
import Checkout from "./pages/Checkout"

const Layout = () => {
  return (
    <div className="min-h-screen max-w-screen w-full h-full flex flex-col">
      <Navbar />
      <div className="max-w-7xl flex-1 md:p-6 p-3 mx-auto w-full h-full">
        <Outlet />
      </div>
    </div>
  )
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    handle: { breadcrumb: "Home" },
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "details/:id",
        element: <Details />,
        handle: {
          breadcrumb: ({ params }: any) => `Details: ${params.id}`,
        },
      },
      {
        path: "checkout",
        element: <Checkout />,
        handle: { breadcrumb: "Checkout" },
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />;
    </>
  )
}



export default App
