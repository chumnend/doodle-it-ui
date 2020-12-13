import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fabric } from 'fabric';
import Contextbar from '../../components/Contextbar';
import CanvasArea from '../../components/CanvasArea';
import Loader from '../../components/Loader';
import ModalSelector from '../../components/ModalSelector';
import PageView from '../../components/PageView';
import Toolbar from '../../components/Toolbar';
import Workspace from '../../components/Workspace';
import * as actions from '../../store/actions';

// calculate starting canvas size based on screen size
let calcSize;
const { innerWidth, innerHeight } = window;
if (innerWidth > innerHeight) {
  calcSize = innerHeight > 500 ? 500 : innerHeight * 0.8;
} else {
  calcSize = innerWidth > 500 ? 500 : innerWidth * 0.8;
}

// default canvas values
const DEFAULT_WIDTH = calcSize;
const DEFAULT_HEIGHT = calcSize;
const DEFAULT_COLOR = '#000002';
const DEFAULT_BACKGROUND_COLOR = '#f2f2f2';
const DEFAULT_PEN_THICKNESS = 2;

// enumeration for Modal
const ModalTypes = {
  NONE: 0,
  SHAPES: 1,
  CLEAR: 2,
  SAVE: 3,
  BACKGROUND: 4,
  RESIZE: 5,
};

// globally accessible fabricCanvas instance
const fabricCanvas = new fabric.Canvas();

const Designer = (props) => {
  const canvasRef = useRef();
  const params = useParams();
  const history = useHistory();

  const [fabricData, setFabricData] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [title, setTitle] = useState('Untitled');
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [freeMode, setFreeMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_BACKGROUND_COLOR,
  );
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [penWidth, setPenWidth] = useState(DEFAULT_PEN_THICKNESS);
  const [modalType, setModalType] = useState(ModalTypes.NONE);

  const [auth, canvas] = useSelector((state) => [state.auth, state.canvas]);
  const dispatch = useDispatch();

  const saveDoodle = useCallback(
    (doodleJSON, doodleId) =>
      dispatch(actions.canvasSaveRequest(doodleJSON, auth.id, doodleId)),
    [dispatch, auth],
  );

  const loadDoodle = useCallback(
    (doodleId) => dispatch(actions.canvasLoadRequest(auth.id, doodleId)),
    [dispatch, auth],
  );

  const clearCanvasState = useCallback(() => dispatch(actions.canvasClear()), [
    dispatch,
  ]);

  useEffect(() => {
    if (params.id) {
      // load doodles
      loadDoodle(params.id);

      // initialize loaded doodle
      fabricCanvas.initialize(canvasRef.current, {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
      });
    } else {
      // initialze default canvas
      fabricCanvas.initialize(canvasRef.current, {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
      });
    }

    // set fabric event listeners
    fabricCanvas.on('mouse:up', () => {
      // on mouse up, update contents of the canvas
      setFabricData(fabricCanvas.toObject());
      setActiveObject(fabricCanvas.getActiveObject());
      // setShowPicker(false);
    });

    fabricCanvas.on('save', () => {
      // save the state of the canvas when prompted
      setFabricData(fabricCanvas.toObject());
      setActiveObject(fabricCanvas.getActiveObject());
      fabricCanvas.renderAll();
    });

    // initialize fabric
    setFabricData(fabricCanvas);
    return () => {
      canvasRef.current = false;
      clearCanvasState();
    };
  }, [params.id, loadDoodle, clearCanvasState]);

  useEffect(() => {
    // after saving a new doodle, redirect to proper address
    if (!params.id && canvas.data) {
      history.push(`/design/${canvas.data.id}`);
    }
  }, [params.id, history, canvas.data]);

  // Toolbar Commands =========================================================
  const toggleFreeMode = () => {
    // set canvas for free drawing or select mode
    if (!freeMode) {
      // deselect any active objects
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      setActiveObject(null);

      // turn free drawing mode on
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = penWidth;
      setFreeMode(true);
    } else {
      fabricCanvas.isDrawingMode = false;
      setFreeMode(false);
    }
  };

  const addLine = () => {
    // add a line element to the canvas
    let coords = [0, 0, 100, 100];
    let line = new fabric.Line(coords, {
      fill: color,
      stroke: color,
      strokeWidth: 2,
    });

    fabricCanvas.add(line);
    fabricCanvas.fire('save');
    closeModal();
  };

  const addCircle = () => {
    // add a circle element to the canvas
    let circle = new fabric.Circle({
      radius: 20,
      fill: color,
    });

    fabricCanvas.add(circle);
    fabricCanvas.fire('save');
    closeModal();
  };

  const addRect = () => {
    // add a rectangle element to the canvas
    let rect = new fabric.Rect({
      width: 50,
      height: 50,
      fill: color,
    });

    fabricCanvas.add(rect);
    fabricCanvas.fire('save');
    closeModal();
  };

  const addTriangle = () => {
    // add a triangle to the canvas
    let triangle = new fabric.Triangle({
      width: 50,
      height: 50,
      fill: color,
    });

    fabricCanvas.add(triangle);
    fabricCanvas.fire('save');
    closeModal();
  };

  const addText = () => {
    // add text box to the page
    let text = new fabric.Text('Hello', {
      fill: color,
    });

    fabricCanvas.add(text);
    fabricCanvas.fire('save');
    closeModal();
  };

  const changeBackgroundColor = (color) => {
    // changes the background color
    fabricCanvas.setBackgroundColor(color);
    setBackgroundColor(color);
    fabricCanvas.fire('save');

    // close modal window
    closeModal();
  };

  const changeCanvasSize = (width, height) => {
    // change the size of the canvas
    fabricCanvas.setWidth(width);
    fabricCanvas.setHeight(height);
    setWidth(width);
    setHeight(height);
    fabricCanvas.fire('save');

    // close modal window
    closeModal();
  };

  const clearCanvas = () => {
    // clears contents of the canvas
    fabricCanvas.clear();
    fabricCanvas.setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
    setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
    fabricCanvas.fire('save');

    // close modal window
    closeModal();
  };

  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  const saveCanvas = () => {
    // prepare payload for saving
    const doodle = {
      title,
      content: JSON.stringify(fabricData),
      width,
      height,
    };

    // execute create or update of doodle
    if (canvas.data) {
      saveDoodle(doodle, canvas.data.id);
    } else {
      saveDoodle(doodle, null);
    }

    // close modal windows
    closeModal();
  };

  // Context Bar Commands =====================================================
  const changeColor = (color) => {
    if (freeMode) {
      // change pen color
      fabricCanvas.freeDrawingBrush.color = color;
    } else {
      // change active object color
      if (activeObject.type === 'path' || activeObject.type === 'line') {
        fabricCanvas.getActiveObject().set('stroke', color);
      } else {
        fabricCanvas.getActiveObject().set('fill', color);
      }
    }

    // save color change
    setColor(color);
    fabricCanvas.fire('save');
  };

  const changePenWidth = (penWidth) => {
    // change pen width
    fabricCanvas.freeDrawingBrush.width = penWidth;
    setPenWidth(penWidth);
    fabricCanvas.fire('save');
  };

  const sendObjectToTop = () => {
    // move object to top of canvas
    fabricCanvas.bringToFront(activeObject);
    fabricCanvas.discardActiveObject();
    setActiveObject(null);
    fabricCanvas.fire('save');
  };

  const sendObjectToBottom = () => {
    // move object to bottom of canvas
    fabricCanvas.sendToBack(activeObject);
    fabricCanvas.discardActiveObject();
    setActiveObject(null);
    fabricCanvas.fire('save');
  };

  const sendObjectForward = () => {
    // move object up one level
    fabricCanvas.bringForward(activeObject);
    fabricCanvas.fire('save');
  };

  const sendObjectBackward = () => {
    // move object down one level
    fabricCanvas.sendBackwards(activeObject);
    fabricCanvas.fire('save');
  };

  const removeObject = () => {
    fabricCanvas.remove(fabricCanvas.getActiveObject());
    fabricCanvas.fire('save');
  };

  // Misc Commands ============================================================
  const closeModal = () => {
    setModalType(ModalTypes.NONE);
  };

  return (
    <>
      <PageView>
        <Toolbar
          freeMode={freeMode}
          toggleFreeMode={toggleFreeMode}
          openShapesModal={() => setModalType(ModalTypes.SHAPES)}
          openClearModal={() => setModalType(ModalTypes.CLEAR)}
          openSaveModal={() => setModalType(ModalTypes.SAVE)}
          openBackgroundModal={() => setModalType(ModalTypes.BACKGROUND)}
          openResizeModal={() => setModalType(ModalTypes.RESIZE)}
        />
        {(canvas.saving || canvas.loading) && <Loader />}
        <Workspace>
          <Contextbar
            freeMode={freeMode}
            activeObject={activeObject}
            color={color}
            changeColor={changeColor}
            penWidth={penWidth}
            changePenWidth={changePenWidth}
            sendObjectToTop={sendObjectToTop}
            sendObjectToBottom={sendObjectToBottom}
            sendObjectForward={sendObjectForward}
            sendObjectBackward={sendObjectBackward}
            removeObject={removeObject}
          />
          <CanvasArea>
            <canvas ref={canvasRef}>Not supported by browser.</canvas>
          </CanvasArea>
        </Workspace>
      </PageView>
      <ModalSelector
        options={ModalTypes}
        selected={modalType}
        close={closeModal}
        addLine={addLine}
        addCircle={addCircle}
        addRect={addRect}
        addTriangle={addTriangle}
        addText={addText}
        background={backgroundColor}
        changeBackgroundColor={changeBackgroundColor}
        width={width}
        height={height}
        changeCanvasSize={changeCanvasSize}
        clearCanvas={clearCanvas}
        title={title}
        changeTitle={changeTitle}
        saveCanvas={saveCanvas}
      />
    </>
  );
};

export default Designer;
