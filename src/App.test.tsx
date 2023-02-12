import 'fake-indexeddb/auto'
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App'

// renders without crashing
test('renders without crashing', () => {
  render(<App />)
})
