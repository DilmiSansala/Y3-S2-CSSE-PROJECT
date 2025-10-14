import { render, screen, fireEvent } from '@testing-library/react';
import WasteRequest from './WasteRequest';
import { BrowserRouter } from 'react-router-dom';

describe('WasteRequest Component', () => {
  // Positive test case: Successful waste request creation
  it('should display a success message when waste request is submitted successfully', async () => {
    render(
      <BrowserRouter>
        <WasteRequest />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Enter waste type/i), {
      target: { value: 'Plastic' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter quantity/i), {
      target: { value: '20 kg' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

    // Expect a success message
    await screen.findByText(/Waste request created successfully!/i);
  });

  // Negative test case: Missing fields
  it('should display an error message when required fields are missing', () => {
    render(
      <BrowserRouter>
        <WasteRequest />
      </BrowserRouter>
    );

    // Simulate form submission without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));

    // Expect an error message
    expect(screen.getByText(/Please fill out all fields./i)).toBeInTheDocument();
  });
});
