import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NexusProvider } from '@/context/NexusContext';
import Login from '@/pages/Login';
import ParentDashboard from '@/pages/ParentDashboard';
import StudentDashboard from '@/pages/StudentDashboard';

function App() {
  return (
    <NexusProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </NexusProvider>
  );
}

export default App;
