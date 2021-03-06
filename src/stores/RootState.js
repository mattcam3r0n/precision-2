// import { observable } from 'mobx';
import DesignViewState from './DesignViewState';
import FieldState from './FieldState';
import AppState from './AppState';
import DrillState from './DrillState';

export default class RootState {

  constructor() {
    this.appState = new AppState(this);
    this.designViewState = new DesignViewState(this);
    this.fieldState = new FieldState(this);
    this.drillState = new DrillState(this);
  }

}
