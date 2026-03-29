import "./App.css";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <>
      <Navbar />
      {/* Offset fixed navbar so content doesn't sit underneath it */}
      <div aria-hidden="true" className="h-16" />
    </>
  );
}

export default App;
