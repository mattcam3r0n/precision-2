import { observable, action, computed } from 'mobx';
import paper from 'paper';
import FieldDimensions from '../lib/FieldDimensions';
import PointerTool from '../lib/PointerTool';
import PathTool from '../lib/PathTool';
import AddMarchersTool from '../lib/AddMarchersTool';
import ZoomAndPanTool from '../lib/ZoomAndPanTool';

export default class DesignViewState {
  @observable zoomFactor;
  @observable center;
  @observable fieldContainerSize;
  @observable activeTool;
  @observable cursor;
  @observable drill;

  lastDelta;
  fieldPaperScope;
  timelinePaperScope;
  

  constructor() {
    this.zoomFactor = 1;
    this.center = {
      x: FieldDimensions.widthInSteps / 2,
      y: FieldDimensions.heightInSteps / 2,
    };
    this.fieldContainerSize = {
      width: FieldDimensions.width,
      height: FieldDimensions.height,
    };
  }

  @computed
  get isPathToolActive() {
    return this.activeTool && this.activeTool.name === 'path';
  }

  @computed
  get isSelectionToolActive() {
    return this.activeTool && this.activeTool.name === 'pointer';
  }

  @computed
  get isAddMarchersToolActive() {
    return this.activeTool && this.activeTool.name === 'addMarchers';
  }

  @action
  setCursor(cursor) {
    this.cursor = cursor;
  }

  @action
  cancelPathTool() {
    if (this.isPathToolActive())
      this.activeTool.cancel();
    this.activatePointerTool();
  }

  @action
  activateAddMarchersTool() {
    this.disposeActiveTool(); // needs to come before constructing new tool
    this.setActiveTool(new AddMarchersTool(this.fieldPaperScope));
  }

  //@action
  activateZoomInTool() {
    this.disposeActiveTool(); // needs to come before constructing new tool
    this.setActiveTool(new ZoomAndPanTool(this.fieldPaperScope, this, 'zoomIn'));
  }

  //@action
  activateZoomOutTool() {
    this.disposeActiveTool(); // needs to come before constructing new tool
    this.setActiveTool(new ZoomAndPanTool(this.fieldPaperScope, this, 'zoomOut'));
  }

  @action
  activatePanTool() {
    this.disposeActiveTool(); // needs to come before constructing new tool
    this.setActiveTool(new ZoomAndPanTool(this.fieldPaperScope, this, 'pan'));
  }

  @action
  activatePointerTool() {
    this.disposeActiveTool(); // needs to come before constructing new tool
    this.setActiveTool(new PointerTool(this.fieldPaperScope));
  }

  @action
  activatePathTool() {
    this.disposeActiveTool(); // needs to come before constructing new tool
    this.setActiveTool(new PathTool(this.fieldPaperScope));
  }

  @action
  setActiveTool(tool) {
    this.activeTool = tool;
    this.setCursor(tool.cursor);
  }

  disposeActiveTool() {
    if (this.activeTool) {
      this.activeTool.dispose();
      this.activeTool = null;
    }
  }

  @action
  newPath() {
    if (!this.activeTool.name === 'path') return;
    this.activeTool.newPath();
  }

  @action
  zoomIn(point) {
    this.zoomAndCenter(point, this.center, this.zoomFactor, 1.1);
  }

  @action
  zoomOut(point) {
    //this.zoomFactor *= 0.9;
    this.zoomAndCenter(point, this.center, this.zoomFactor, 0.9);
  }  

  zoomAndCenter(point, currentCenter, currentZoom, zoomFactor) {
    // based on https://matthiasberth.com/tech/stable-zoom-and-pan-in-paperjs 
    const c = new paper.Point(currentCenter);
    const oldZoom = currentZoom;
    const newZoom = currentZoom * zoomFactor;
    const beta = oldZoom / newZoom;
    const pc = point.subtract(this.center);
    const a = point.subtract(pc.multiply(beta)).subtract(c);
    this.setZoom(newZoom);
    this.setCenter(c.add(a));
  }

  @action
  zoomToFit() {
    // TODO: need better algorithm that takes height into account
    this.zoomFactor =
      this.fieldContainerSize.width / FieldDimensions.widthInSteps;
    this.reCenter();
  }

  @action
  reCenter() {
    this.center = {
      x: FieldDimensions.widthInSteps / 2,
      y: FieldDimensions.heightInSteps / 2,
    };
  }

  setFieldPaperScope(paperScope) {
    this.fieldPaperScope = paperScope;
  }

  setTimelinePaperScope(paperScope) {
    this.timelinePaperScope = paperScope;
  }

  @action
  setZoom(newFactor) {
    this.zoomFactor = newFactor;
  }

  @action
  setCenter(newCenter) {
    this.center = newCenter;
  }

  @action
  setCenterDelta(delta) {
    this.center = {
      x: this.center.x - delta.x,
      y: this.center.y - delta.y,
    };
  }

  @action
  fieldInitialized() {
    // TODO: open last drill?
    this.drill = this.createNewDrill();
  }

  @action
  setFieldContainerSize(newSize) {
    this.fieldContainerSize = newSize;
  }

  // temporary helper
  createNewDrill() {
    const drill = {};
    drill.marchers = [];
    for(let i=0; i < 16; i++) {
      const m = {
        initialState: {
          x: 12 + ((i % 4) * 2),
          y: 6 + (Math.floor(i / 4) * 2),
          direction: 90
        },
        currentState: {
          x: 12 + ((i % 4) * 2),
          y: 6 + ((i % 4) * 2),
          direction: 90
        }
      };
      drill.marchers.push(m);
    }
    return drill;
  }
}
