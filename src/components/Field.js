import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';

import paper from 'paper';
import FieldPainter from '../lib/FieldPainter';
import { reaction } from 'mobx';
import PanTool from '../lib/PanTool';

class Field extends Component {
  onResize = () => {
    if (!this.fieldPainter) return;
    const { appState } = this.props;
    const fieldContainer = document.getElementById('fieldContainer');
    const { clientWidth, clientHeight } = fieldContainer;
    this.fieldPainter.resize(clientWidth, clientHeight);

    appState.setFieldContainerSize({
      width: clientWidth,
      height: clientHeight
    });
    appState.zoomToFit();
  };

  onPan = (delta) => {
    const { appState } = this.props;
    console.log('appState', appState);
    console.log('onPan', appState.center.x, appState.center.y, delta);
    appState.setCenter({
      x: appState.center.x - delta.x,
      y: appState.center.y - delta.y
    });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    reaction(
      () => this.props.appState.zoomFactor,
      (zoomFactor, reaction) => {
        console.log('zoom factor is ', zoomFactor);
        this.fieldPainter.zoom(zoomFactor);
      }
    );

    reaction(
      () => this.props.appState.center,
      (center, reaction) => {
        console.log('center is ', center);
        this.fieldPainter.setCenter(center);
      }
    );

    this.drawField();
    this.onResize();

    const panTool = new PanTool(this.onPan);
  }

  drawField() {
    const canvas = document.getElementById('fieldCanvas');
    this.fieldPainter = new FieldPainter(canvas);
    this.fieldPainter.draw();
    this.onResize();
  }

  render() {
    return (
      <div
        id="fieldContainer"
        style={{
          flex: 'auto',
          overflow: 'hidden',
          // backgroundColor: 'gray',
          //   width: 'calc(100vw - 240px)',
          //   height: 'calc((100vw - 240px) / 2)',
        }}
      >
        <canvas
          id="fieldCanvas"
          //   data-paper-resize="true"
          // style={{ width: '100%', height: '100%', border: 'solid 1px black' }}
          style={{ border: 'none' }}
        />
      </div>
    );
  }
}

export default compose(
  inject('appState'),
  observer,
)(Field);
