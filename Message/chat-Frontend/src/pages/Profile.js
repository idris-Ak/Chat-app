import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments } from '@fortawesome/free-solid-svg-icons'; 

const Profile = () => {
  return <div>
    
    Profile
    <Link to='/'>
      <FontAwesomeIcon icon={faHome} />
    </Link>
    <Link to='/chat'>
      <FontAwesomeIcon icon={faComments} />
    </Link>

  </div>;
};

export default Profile;
