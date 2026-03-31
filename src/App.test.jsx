import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the top app bar', async () => {
    render(<App />);
    expect(await screen.findByText('Workout Tracker')).toBeInTheDocument();
  });

  it('renders the home view by default', async () => {
    render(<App />);
    expect(await screen.findByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});
