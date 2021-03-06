import React from 'react';
import PropTypes from 'prop-types';
import * as Styles from './styles';

const Workspace = (props) => {
  return <Styles.Workspace>{props.children}</Styles.Workspace>;
};

Workspace.propTypes = {
  children: PropTypes.node,
};

export default Workspace;
