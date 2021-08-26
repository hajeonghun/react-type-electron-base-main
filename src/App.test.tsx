import '@testing-library/jest-dom';
import {render, fireEvent, screen} from '@testing-library/react';
import App from './App';

const user = {
  id: 202,
};

describe('App', () => {
  it('App 컴포넌트가 hello 가 출력이 됨 ', () => {
    render(<App />);
    // expect(screen.getByText('hello')).toBeInTheDocument();
    const appElement = screen.getByTestId('app-1');

    expect(appElement).toBeInTheDocument();
    expect(appElement).toHaveTextContent('Hello');
  });
});
