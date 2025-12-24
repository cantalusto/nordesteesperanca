import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CallManagement from './components/CallManagement';
import EmployeeManagement from './components/EmployeeManagement';
import Reports from './components/Reports';
import { User, UserRole } from './types';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check session logic could go here, for now relying on memory state
    // In a real app, check localStorage/cookie for token
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // If employee logs in, direct to calls immediately
    if (loggedInUser.role === UserRole.EMPLOYEE) {
      setCurrentView('calls');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return user.role === UserRole.ADMIN ? <Dashboard calls={StorageService.getCalls()} /> : <CallManagement currentUser={user} />;
      case 'calls':
        return <CallManagement currentUser={user} />;
      case 'employees':
        return user.role === UserRole.ADMIN ? <EmployeeManagement /> : null;
      case 'reports':
        return user.role === UserRole.ADMIN ? <Reports /> : null;
      default:
        return <Dashboard calls={StorageService.getCalls()} />;
    }
  };

  return (
    <Layout 
        user={user} 
        onLogout={handleLogout} 
        currentView={currentView} 
        onChangeView={setCurrentView}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
