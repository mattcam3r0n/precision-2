import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FieldController from '../lib/FieldController';

@inject('designViewState')
@observer
class Field extends Component {

  controller;

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    const { designViewState } = this.props;

    window.addEventListener('resize', this.onResize);

    const canvas = document.getElementById('fieldCanvas');
    this.controller = new FieldController(canvas, designViewState);

    this.onResize();
    designViewState.fieldInitialized();
  }

  onResize = () => {
    if (!this.controller) return;
    const fieldContainer = document.getElementById('fieldContainer');
    this.controller.resize(fieldContainer.clientWidth, fieldContainer.clientHeight);
  };

  render() {
    const { designViewState } = this.props;
    return (
      <div
        id="fieldContainer"
        style={{
          flex: 'auto',
          overflow: 'hidden',
        }}
      >
        <canvas
          id="fieldCanvas"
          style={{ cursor: designViewState.cursor }}
        />
      </div>
    );
  }
}

export default Field;
