import logo from './BR.svg';
import { Link } from 'react-router-dom';
export const Footer = () => {
  return (
    <Link to="https://github.com/sudo-vaibhav/backroad" target="_blank">
      <footer className="fixed bottom-0 right-0 p-5 bg-gradient-to-br from-[#06A261] to-[#047863] rounded-tl-xl">
        <img src={logo} alt="backroad logo" width={30} />
      </footer>
    </Link>
  );
};
