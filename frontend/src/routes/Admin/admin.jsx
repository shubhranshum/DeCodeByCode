import React from 'react';
import Navbar from '../../components/Navbar/navbar.jsx';
import AdminPage from '../../components/Admin/Admin.jsx';

const Admin = () => {
    return(
        <>
        <Navbar activePage="Admin"/>
        <AdminPage/>
        </>
    );
}
export default Admin;