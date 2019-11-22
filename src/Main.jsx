import React, { useState, useEffect } from 'react';

function Main() {
  const [temperatures, setTemperatures] = useState({
    sensoreOne: window.__SENSOR_ONE_DATA__,
    sensorTwo: window.__SENSOR_TWO_DATA__,
  });

  useEffect(() => {
    delete window.__SENSOR_ONE_DATA__;
    delete window.__SENSOR_TWO_DATA__;
  }, []);

  console.log(temperatures);

  return (<h1>Hello World!</h1>)
};

export default Main;