import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import './App.css';

// You'll create these components later
import Header from './components/Header';
import DocumentList from './components/DocumentList';
import DocumentEditor from './components/DocumentEditor';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<DocumentList />} />
          <Route path="/document/:id" element={<DocumentEditor />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;