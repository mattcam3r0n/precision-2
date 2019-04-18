import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme) => ({});

class DropDownMenuItem extends Component {
  state = {};

  handleClick = () => {
    if (this.props.onClick) this.props.onClick();
    if (this.props.onClose) this.props.onClose();
  };

  render() {
    const { onClick, children, ...other  } = this.props;
    return (
      <React.Fragment>
        <MenuItem onClick={this.handleClick} {...other}>{ children }</MenuItem>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DropDownMenuItem);
