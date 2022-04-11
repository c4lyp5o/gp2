// import './App.css';
import './admin/admin.css';
import AdminFooter from './admin/components/AdminFooter';
import AdminHeader from './admin/components/AdminHeader';
import AdminLoginForm from './admin/components/AdminLoginForm';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <AdminHeader />
        <AdminLoginForm />
        <AdminFooter />
      </header>
    </div>
  );
}

export default App;
