import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ModeCard = ({ type, icon, title, description, buttonText, isActive = true }) => {
  const routePath = isActive ? `/${type.toLowerCase()}` : '/login';
  
  return (
    <div className="bg-white p-6 rounded-md shadow-sm border flex flex-col h-full">
      <div className="mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-bold mt-2">{title}</h3>
      </div>
      <p className="text-gray-600 flex-grow">{description}</p>
      <Link
        to={routePath}
        className={`mt-6 py-2 px-4 rounded text-center ${
          type === 'home' 
            ? 'bg-primary text-white hover:bg-primary-dark' 
            : 'border border-primary text-primary hover:bg-gray-50'
        } transition-colors`}
      >
        {buttonText}
      </Link>
    </div>
  );
};

ModeCard.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default ModeCard;