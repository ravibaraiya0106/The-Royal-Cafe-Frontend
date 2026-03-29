import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <Navbar />
      {/* Offset fixed navbar so content doesn't sit underneath it */}
      <div aria-hidden="true" className="h-16" />
      <Footer />
    </>
  );
}

export default App;
