import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react';

import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ButtonFlyOut from './ButtonFlyOut';

// icons
import Search from '@material-ui/icons/Search';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import Fullscreen from '@material-ui/icons/Fullscreen';
import PanTool from '@material-ui/icons/PanTool';

const styles = (theme) => ({
  fab: {
    margin: 0,
  },
});

@inject('designViewState')
@observer
class ZoomToolsFlyout extends Component {
  state = {};

  handleZoomIn = (e) => {
    e.preventDefault();
    this.props.designViewState.zoomIn();
  };

  handleZoomOut = (e) => {
    e.preventDefault();
    this.props.designViewState.zoomOut();
  };

  handleZoomToFit = (e) => {
    e.preventDefault();
    this.props.designViewState.zoomToFit();
  };

  handlePanTool = () => {
    this.props.designViewState.activatePanTool();
  };

  render() {
    const { classes } = this.props;
    return (
      <ButtonFlyOut icon={<Search />} tooltip="Zoom & Pan">
        <Tooltip title="">
          <Fab
            size="small"
            className={classes.fab}
            color="inherit"
            onClick={this.handlePanTool}
          >
            <PanTool />
          </Fab>
        </Tooltip>
        <Tooltip title="">
          <Fab
            size="small"
            className={classes.fab}
            color="inherit"
            onClick={this.handleZoomIn}
          >
            <ZoomIn />
          </Fab>
        </Tooltip>
        <Tooltip title="">
          <Fab
            size="small"
            className={classes.fab}
            color="inherit"
            onClick={this.handleZoomOut}
          >
            <ZoomOut />
          </Fab>
        </Tooltip>
        <Tooltip title="">
          <Fab
            size="small"
            className={classes.fab}
            color="inherit"
            onClick={this.handleZoomToFit}
          >
            <Fullscreen />
          </Fab>
        </Tooltip>
      </ButtonFlyOut>
    );
  }
}

export default withStyles(styles)(ZoomToolsFlyout);
