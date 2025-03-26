import React from 'react';
import '../comp_styles/Button.css';

const Button = ({ href, children }) => {
  return (
    <a href={href} className="button" target='_blank' rel='noreferrer'>
      {children}
    </a>
  );
};

export default Button;
