import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Poppins', sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }
  .react-calendar {
    width: 100%;
    background: ${({ theme }) => theme.cardBg};
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 0.5rem;
    color: ${({ theme }) => theme.text};
    font-family: inherit;
  }

  .react-calendar__tile {
    padding: 0.75rem 0.5rem;
    border-radius: 0.4rem;
    transition: background 0.2s;
    color: ${({ theme }) => theme.text};
  }

  .react-calendar__tile--active,
  .react-calendar__tile:focus {
    background: ${({ theme }) => theme.primary};
    color: white;
  }

  .react-calendar__tile--now {
    background: ${({ theme }) => theme.chart.barSecondary};
    color: white;
    
  }

  .react-calendar__navigation button {
    color: ${({ theme }) => theme.text};
    background: none;
    border: none;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .react-calendar__month-view__weekdays {
    text-transform: uppercase;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.subtitle};
    text-align: center;
  }

  .reserved-green {
  background-color: rgba(0, 128, 0, 0.2);
  border: 2px solid green;
  border-radius: 0.5rem;
}

.reserved-red {
  background-color: rgba(255, 0, 0, 0.2);
  border: 2px solid red;
  border-radius: 0.5rem;
}

.reserved-orange {
  background-color: rgba(255, 165, 0, 0.2);
  border: 2px solid orange;
  border-radius: 0.5rem;
}

`;

export default GlobalStyle;
