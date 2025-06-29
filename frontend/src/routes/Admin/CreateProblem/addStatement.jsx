import React from 'react';
import Navbar from '../../../components/Navbar/navbar.jsx';
import StatementSection from '../../../components/Admin/CreateProblem/statement.jsx';

export default function AddStatement() {
    return(
        <>
        <Navbar activePage="Admin"/>
        <StatementSection/>
        </>
    );
}
