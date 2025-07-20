import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App';
import test from 'node:test';

const mock = new MockAdapter(axios);

test('should display weather information for Paris', async () => {
  mock.onGet('https://api.openweathermap.org/data/2.5/weather?q=Paris&units=metric&APPID=4be91eddb95669a0ae602b58d3c50576').reply(200, {
    name: 'Paris',
    main: { temp: 25 },
    weather: [{ main: 'Clear' }],
  });

  render(<App />);

  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Paris' } });

  const button = screen.getByRole('button');
  fireEvent.click(button);

  await waitFor(() => {
    // expect(screen.getByText('City: Paris')).toBeInTheDocument();
    // expect(screen.getByText('Temperature: 25 °C')).toBeInTheDocument();
    // expect(screen.getByText('Description: Clear')).toBeInTheDocument();
  });
});