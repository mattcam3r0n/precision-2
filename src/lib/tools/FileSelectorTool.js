import FieldTool from './FieldTool';
import PathLine from '../field/PathLine';
import ToolNames from './ToolNames';

export default class FileSelectorTool extends FieldTool {
  constructor(paperScope) {
    super(ToolNames.FILE_SELECTOR, paperScope);
    this.tool.onMouseDown = this.onMouseDown;
    this.tool.onMouseMove = this.onMouseMove;
    this.paths = [];
    this.activePath = null;
  }

  dispose() {
    this.disposePaths();
    this.tool.off('mousedown');
    this.tool.off('mousemove');
    super.dispose();
  }

  disposePaths() {
    if (!this.paths) return;
    this.paths.forEach(p => {
      p.remove();
    });  
  }

  get cursor() {
    return 'crosshair';
  }
  
  onMouseDown = (event) => {
    const { item } = event;
    const { activePath } = this;

    const marcherClicked = this.itemIsMarcher(item);

    if (activePath && marcherClicked) {
      activePath.add(event.point);
      return;
    }

    if (!activePath && marcherClicked) {
      this.startPath();
      return;
    }

  }

  onMouseMove = (event) => {
    const { item } = event;
    const { activePath } = this;

    // ignore mouse moves that originate from other than the canvas
    if (!super.isCanvasEvent(event) && activePath) {
      activePath.hideLastSegment();
      return;
    }

    if (activePath) {
      activePath.setEndPoint(event.point);
    }

    if (this.itemIsMarcher(item)) {
      this.highlightMarcher(item);
      return;
    }
  }

  startPath() {
    this.activePath = new PathLine(this.marcher.position, {
        showSegmentLength: false,
        dashArray: [0.25, 0.5],
        selected: false,
        activeColor: 'black',
        inactiveColor: 'black'
    });
    this.paths.push(this.activePath);
  }  
}
