import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Error from '@mui/icons-material/Error';
import './notFound.css';

const NotFound = () => {
  return (
    <div className="PageNotFound">
      <Error />
      <Typography>404!</Typography>
      <p>This page does not exist</p>
      <p>But an amazing product does!</p>
      <Link to="/store">Store</Link>
    </div>
  );
};

export default NotFound;
