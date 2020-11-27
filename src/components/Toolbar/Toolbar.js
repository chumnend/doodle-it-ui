import PropTypes from 'prop-types';
import ToolbarButton from './ToolbarButton';
import * as Styles from './styles';

const Toolbar = (props) => {
  return (
    <Styles.Toolbar>
      <Styles.Container>
        <ToolbarButton
          toggable
          active={props.freeMode}
          clicked={props.toggleFreeMode}
          title="Activate the pen"
        >
          <Styles.ToolbarIcon className="material-icons">
            edit
          </Styles.ToolbarIcon>
          <Styles.ToolbarName>Draw</Styles.ToolbarName>
        </ToolbarButton>
        <ToolbarButton
          clicked={props.openShapesModal}
          title="Add a shape to the canvas"
        >
          <Styles.ToolbarIcon className="material-icons">
            extension
          </Styles.ToolbarIcon>
          <Styles.ToolbarName>Shapes</Styles.ToolbarName>
        </ToolbarButton>
        <div style={{ flexGrow: 1 }} />
        <ToolbarButton clicked={props.openClearModal} title="Clear the canvas">
          <Styles.ToolbarIcon className="material-icons">
            delete_forever
          </Styles.ToolbarIcon>
          <Styles.ToolbarName>Clear</Styles.ToolbarName>
        </ToolbarButton>
        <ToolbarButton clicked={props.openSaveModal} title="Save this doodle">
          <Styles.ToolbarIcon className="material-icons">
            save
          </Styles.ToolbarIcon>
          <Styles.ToolbarName>Save</Styles.ToolbarName>
        </ToolbarButton>
        <ToolbarButton
          clicked={props.openSettingsModal}
          title="Modify canvas settings"
        >
          <Styles.ToolbarIcon className="material-icons">
            settings
          </Styles.ToolbarIcon>
          <Styles.ToolbarName>Settings</Styles.ToolbarName>
        </ToolbarButton>
      </Styles.Container>
    </Styles.Toolbar>
  );
};

Toolbar.propTypes = {
  freeMode: PropTypes.bool,
  toggleFreeMode: PropTypes.func,
  openShapesModal: PropTypes.func,
  openClearModal: PropTypes.func,
  openSaveModal: PropTypes.func,
  openSettingsModal: PropTypes.func,
};

export default Toolbar;
