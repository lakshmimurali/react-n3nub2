import { render, screen, fireEvent } from '@testing-library/react';
import AddToDo from './App';

test('renders addto do text box', () => {
  render(<AddToDo />);
  const toDoBox = screen.getByTestId('add-todo-box');
  expect(toDoBox).toBeInTheDocument();
});

test('check placeholder exist for the textbox', () => {
  render(<AddToDo />);
  const toToDoBox = screen.getByPlaceholderText(
    'It is time to plan your tasks'
  );
  expect(toToDoBox).toBeInTheDocument();
});

test('Check adding todo via button click works', () => {
  render(<AddToDo />);
  fireEvent.input(screen.getByTestId('add-todo-box'), {
    target: { value: 'Learn React, Learn Unit Test cases' },
  });
  fireEvent.click(screen.getByTestId('SubmitToDo'), {
    bubbles: true,
    cancelable: true,
  });
  const todolisttext = screen.getByText('Learn React, Learn Unit Test cases');
  expect(todolisttext).toBeInTheDocument();
});

test('Check adding todo via enter key in text box', () => {
  render(<AddToDo />);
  fireEvent.input(screen.getByTestId('add-todo-box'), {
    target: { value: 'Learn Python, Learn Unit Test cases' },
  });
  fireEvent.keyDown(screen.getByTestId('add-todo-box'), {
    key: 'Enter',
    code: 'Enter',
    charCode: 13,
  });
  const todolisttext = screen.getByText('Learn Python, Learn Unit Test cases');
  expect(todolisttext).toBeInTheDocument();
});
