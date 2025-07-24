import React from 'react';
import Navbar from '../../components/Navbar/navbar.jsx';
import AdminPage from '../../components/Admin/Admin.jsx';

const Admin = () => {
    return(
        <>
        <Navbar activePage="Admin"/>
        <div className = "pt-22.5"><AdminPage/></div>
        </>
    );
}
export default Admin;