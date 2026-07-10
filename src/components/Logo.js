import logo from '../assets/logo.png';

export default function Logo({ size = 'small' }) {
  const style =
    size === 'large' ? { width: 320, height: 78 } : { width: 180, height: 44 };
  return <img src={logo} alt="Gravity Training" style={{ ...style, objectFit: 'contain' }} />;
}
