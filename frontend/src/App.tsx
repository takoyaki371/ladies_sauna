import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Map from './pages/Map';
import Search from './pages/Search';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/search" element={<Search />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
