import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../screen/Login';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Login Component', () => {
  beforeEach(() => {
    mock.reset();
  });
  it('should make a POST request to login API and navigate based on response', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    const rutInput = getByPlaceholderText('Rut');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Login');
    fireEvent.changeText(rutInput, '12345678-9');
    fireEvent.changeText(passwordInput, 'password');
    mock.onPost('/login').reply(200, { id_tipo_usuario: 1 });
    fireEvent.press(loginButton);
    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].data).toEqual(JSON.stringify({
        rut: '12345678-9',
        password: 'password'
      }));
      // Verify navigation to Admin or Guardia screen based on id_tipo_usuario
    });
  });

  it('should handle API error response and show alert', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);
    const rutInput = getByPlaceholderText('Rut');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Login');
    fireEvent.changeText(rutInput, '12345678-9');
    fireEvent.changeText(passwordInput, 'password');
    mock.onPost('/login').reply(401, { message: 'Credenciales incorrectas' });
    fireEvent.press(loginButton);
    await waitFor(() => {
      expect(getByTestId('alert')).toHaveTextContent('Credenciales incorrectas');
    });
  });
});
