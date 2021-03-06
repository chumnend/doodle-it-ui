import React from 'react';
import PropTypes from 'prop-types';
import * as Styles from './styles';

const ToolbarButton = (props) => {
  return (
    <Styles.ToolbarButton
      toggable={props.toggable}
      active={props.active}
      onClick={props.clicked}
      title={props.title}
    >
      {props.children}
    </Styles.ToolbarButton>
  );
};

ToolbarButton.defaultProps = {
  toggable: false,
  active: false,
};

ToolbarButton.propTypes = {
  children: PropTypes.node,
  toggable: PropTypes.bool,
  active: PropTypes.bool,
  clicked: PropTypes.func,
  title: PropTypes.string,
};

export default ToolbarButton;
