import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login page if not authenticated
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
