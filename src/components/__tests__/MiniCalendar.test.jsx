import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import MiniCalendar from '../dashboard/MiniCalendar';
import { format } from 'date-fns';

// Definimos el tema para los colores etc
const theme = {
  background: '#fff',
  gray: '#ccc',
  cardBackground: '#f9f9f9',
  transparent: 'transparent',
  green: 'green',
  red: 'red',
  orange: 'orange',
};

// Función helper para renderizar el componente envuelto en el ThemeProvider
function renderWithTheme(ui) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('MiniCalendar component', () => {
  // Definimos la lista de nombres de los meses 
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  beforeEach(() => {
    renderWithTheme(<MiniCalendar />);
  });

  // Test para verificar y loguear todos los nombres de los botones del calendario
  it('should log all calendar button names', () => {
    const dayButtons = screen.getAllByRole('button');
    const allButtonNames = [];
    dayButtons.forEach(button => {
      allButtonNames.push(button.textContent);
    });
    console.log('All button names:', allButtonNames);
    expect(true).toBe(true); 
  });

  // Test para la fecha actual (6 de mayo de 2025)
  it('should render calendar days', () => {
    const today = new Date(2025, 4, 7); // El mes de enero   (0 = enero, 4 = mayo)
    // **Volvemos a formatear la etiqueta para incluir el mes y el año**
    const label = format(today, 'MMMM d, yyyy');

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  // Test 'reserved-green' al día 3 de abril de 2025
  it('should apply reserved-green class to 2025-04-03', async () => {
    // Obtiene el botón para ir al mes anterior
    const prevButton = screen.getByRole('button', { name: '‹' });
    // Simulamos el click
    fireEvent.click(prevButton);
    // Espera a que el texto del mes visible cambie a April 2025
    await screen.findByText('April 2025');

    const date = new Date(2025, 3, 3);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    // Formatea la etiqueta esperada 
    const expectedLabel = `${month} ${day}, ${year}`;
    const tileButton = await screen.findByRole('button', { name: expectedLabel });
    expect(tileButton).toHaveClass('reserved-green');
  });

  // Test 'reserved-red' al día 16 de abril de 2025
  it('should apply reserved-red class to 2025-04-16', async () => {
    const prevButton = screen.getByRole('button', { name: '‹' });
    fireEvent.click(prevButton);
    await screen.findByText('April 2025');

    const date = new Date(2025, 3, 16);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const expectedLabel = `${month} ${day}, ${year}`;
    const tileButton = await screen.findByRole('button', { name: expectedLabel });
    expect(tileButton).toHaveClass('reserved-red');
  });

  // Test 'reserved-orange' al día 30 de abril de 2025 
  it('should apply reserved-orange class to 2025-04-30', async () => {
    const prevButton = screen.getByRole('button', { name: '‹' });
    fireEvent.click(prevButton);
    await screen.findByText('April 2025');

    const date = new Date(2025, 3, 30);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const expectedLabel = `${month} ${day}, ${year}`;
    const tileButton = await screen.findByRole('button', { name: expectedLabel });
    expect(tileButton).toHaveClass('reserved-orange');
  });
});