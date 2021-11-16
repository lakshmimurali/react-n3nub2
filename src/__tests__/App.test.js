import { screen, cleanup, render } from '@testing-library/react';
import { screen, cleanup, render } from '@testing-library/react';
import { screen, cleanup, render } from '@testing-library/react';
import { screen, cleanup, render } from '@testing-library/react';
import { screen, cleanup, render } from '@testing-library/react';
import { screen, render, cleanup } from '@testing-library/react';
import { cleanup, screen, render } from '@testing-library/react';
import AddToDo from './App';

test('Need to render the AddTo Component', () => {
  render(<AddToDo />);
  const toDoTextBox = screen.getByTestId('add-todo-box');
  expect(toDoTextBox).toBeInTheDocument();
});

test('need to check to todo component rendered', () => {
  render(<AddToDo />);
  const textBox = screen.getByTestId('add-to-box');
  expect(textBox).toBeInTheDocument();
});
