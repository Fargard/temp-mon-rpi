import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main.jsx';

const temperatures = {
  sensorOne: window.__SENSOR_ONE_DATA__,
  sensorTwo: window.__SENSOR_TWO_DATA__,
};

delete window.__SENSOR_ONE_DATA__;
delete window.__SENSOR_TWO_DATA__;

document.getElementById('initialState').outerHTML = "";

ReactDOM.render(<Main temperatures={temperatures} />, document.getElementById('root'));