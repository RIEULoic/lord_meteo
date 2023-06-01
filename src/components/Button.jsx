import "./Button.css";

const Button = ({ children, onClick }) => (
  <button className="classicButton" onClick={onClick}>
    {children}
  </button>
);

export default Button;
