import React from 'react';
import PropTypes from 'prop-types';
import * as Styles from './styles';

const FormError = (props) => {
  return <Styles.FormError>{props.children}</Styles.FormError>;
};

FormError.propTypes = {
  children: PropTypes.node,
};

export default FormError;
