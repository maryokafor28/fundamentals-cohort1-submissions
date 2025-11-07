import { RouterProvider } from "react-router-dom";
import router from "./router";
import Layout from "./components/layout/Layout";
import { Toaster } from "sonner";
function App() {
  return (
    <Layout>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </Layout>
  );
}

export default App;
