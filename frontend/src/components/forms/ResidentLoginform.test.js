import { render, screen, fireEvent } from '@testing-library/react';
import ResidentLoginform from './ResidentLoginform';
import { BrowserRouter } from 'react-router-dom';

describe('ResidentLoginform Component', () => {
  // Positive test case: Successful login
  it('should display success message when login is successful', async () => {
    render(
      <BrowserRouter>
        <ResidentLoginform />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Enter your Email/i), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: 'correctPassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Expect the success message (Assuming it's displayed upon successful login)
    // Use async wait if your component fetches data
    await screen.findByText(/Welcome!/i);
  });

  // Negative test case: Incorrect login
  it('should display error message when login fails', async () => {
    render(
      <BrowserRouter>
        <ResidentLoginform />
      </BrowserRouter>
    );

    // Simulate user input with incorrect password
    fireEvent.change(screen.getByPlaceholderText(/Enter your Email/i), {
      target: { value: 'testuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
      target: { value: 'wrongPassword' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Expect an error message
    await screen.findByText(/Login failed. Please try again./i);
  });
});
