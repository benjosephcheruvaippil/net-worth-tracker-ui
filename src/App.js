import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AssetDetails from './pages/AssetDetails';

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <div style={{marginLeft:'250px',padding:'20px'}}>
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/assets' element={<AssetDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
