import React from 'react';
import { Navigate } from 'react-router-dom';

export const ChequesLandingPage: React.FC = () => {
  return <Navigate to="/cheques/books" replace />;
};
