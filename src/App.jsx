import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/current-project" element={<Home />} />
        <Route path="/other-project" element={<Home />} />
        <Route path="/my-journey" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

