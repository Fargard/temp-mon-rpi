import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import { Chart } from 'react-charts'
import styled from 'styled-components';

function getChartData(temperatures) {
  const result = temperatures.reduce((accum, item) => {
    accum.push([
      moment(`${moment(item.date).format('DD.MM.YYYY')} ${item.time}`, 'DD.MM.YYYY HH:mm'),
      parseFloat(item.temperature),
    ]);
    return accum;
  }, []);
  return result;
};

function Main({ temperatures }) {
  const temp = {
    sensorOne: {
      currentTemp: temperatures.sensorOne[temperatures.sensorOne.length - 1] ? temperatures.sensorOne[temperatures.sensorOne.length - 1].temperature : 0,
      values: temperatures.sensorOne,
    },
    sensorTwo: {
      currentTemp: temperatures.sensorTwo[temperatures.sensorTwo.length - 1] ? temperatures.sensorTwo[temperatures.sensorTwo.length - 1].temperature : 0,
      values: temperatures.sensorTwo
    }
  };

  const data = useMemo(
    () => [
      {
        label: 'Температура воздуха',
        data: getChartData(temp.sensorOne.values)
      },
      {
        label: 'Температура отопления',
        data: getChartData(temp.sensorTwo.values)
      }
    ],
    []
  );

  const axes = useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom', show: true },
      { type: 'linear', position: 'left', show: true }
    ],
    []
  );

  return (
    <Wrapper>
      <Header>
        <h1>Мониторинг температуры</h1>
        <TemperatureWrapper>
          <p>Текущая температура воздуха - {temp.sensorOne.currentTemp} С</p>
          <p>Текущая температура отопления - {temp.sensorTwo.currentTemp} С</p>
        </TemperatureWrapper>
      </Header>
      <Content>
        <Chart data={data} axes={axes} tooltip />
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1440px;
  height: calc(100vh - (8px * 2));
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TemperatureWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > p {
    margin: 16px;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 0 40px;
  max-height: 500px;
`;

export default Main;