import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavMenu from './components/navmenu/navmenu';
import Footer from './components/footer/footer';
import About from './components/about/about';
import Events from './components/events/events';
import Resources from './components/resources/resources';
import './App.css';
import Admin from './components/admin/admin';
import Login from './components/login/login';
import EditResourceRequests from './components/admin/edit-resource-requests';
import EventRequests from './components/admin/event-requests';
import ResourceRequests from './components/admin/resource-requests';
import AddEvent from './components/admin/add-event';
import EditEvent from './components/admin/edit-event';
import AddResource from './components/admin/add-resource';
import EditResource from './components/admin/edit-resource';
import EditFeaturedResources from './components/admin/edit-featured-resources';
import EditFeaturedEvents from './components/admin/edit-featured-events';

function App() {
  return (
    <Container fluid className="App d-flex flex-column justify-content-between">
      <div>
        <NavMenu />
        <Routes>
          <Route path="/" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="admin/edit-requests"
            element={<EditResourceRequests />}
          />
          <Route path="admin/event-requests" element={<EventRequests />} />
          <Route
            path="admin/resource-requests"
            element={<ResourceRequests />}
          />
          <Route path="admin/add-event" element={<AddEvent />} />
          <Route path="admin/edit-event" element={<EditEvent />} />
          <Route path="admin/add-resource" element={<AddResource />} />
          <Route path="admin/edit-resource" element={<EditResource />} />
          <Route path="admin/edit-featured-resources" element={<EditFeaturedResources />} />
          <Route path="admin/edit-featured-events" element={<EditFeaturedEvents />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer className="footer" />
    </Container>
  );
}

export default App;
