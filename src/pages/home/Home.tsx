import React from 'react';
import {Link} from "react-router-dom";

function createNewProject() {
    // TODO: Create a new project
}

function openProject() {
    // TODO: Open a new project
}

const Home: React.FC = () => {
    return (
        <div>
            <div className="container">
                
            <div className="text-center p-4 p-lg-5">
                <p className="fw-bold text-primary mb-2">
                    A tool to generate testcase for competitive programming
                </p>
                
                <h1 className="fw-bold mb-4">MochaGen</h1>
                <button className="btn btn-primary fs-5 me-2 py-2 px-4" type="button">
                    <Link to="/description">New Project</Link>            
                </button>
                <button className="btn btn-light fs-5 py-2 px-4" type="button">
                    <Link to="/description">Open An Exist Project</Link>
                </button>
            </div>
            </div>
            
            
        </div>  
    );
}

export default Home;
