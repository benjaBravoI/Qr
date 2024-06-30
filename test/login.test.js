import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Login from "./screen/Login";
import axios from 'axios';

jest.mock('axios');

test('debe actualizar el estado del formulario cuando el usuario ingresa el rut y la contraseña', () => {
  const { getByPlaceholderText } = render(<Login navigation={{ navigate: jest.fn() }} />);
  const rutInput = getByPlaceholderText('Ingrese Su Rut');
  const contrasenaInput = getByPlaceholderText('Ingrese Su Contraseña');

  fireEvent.changeText(rutInput, '12345678-9');
  fireEvent.changeText(contrasenaInput, 'password');

  expect(rutInput.props.value).toBe('12345678-9');
  expect(contrasenaInput.props.value).toBe('password');
});

test('debe llamar a la API y navegar a la pantalla correcta en caso de login exitoso', async () => {
  const mockNavigate = jest.fn();
  axios.post.mockResolvedValueOnce({
    data: { rut: '12345678-9', id_tipo_usuario: 1 }
  });

  const { getByText } = render(<Login navigation={{ navigate: mockNavigate }} />);
  const loginButton = getByText('Inciar Sesion');

  fireEvent.press(loginButton);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('Admin');
  });
});

test('debe mostrar una alerta en caso de error de login', async () => {
  axios.post.mockRejectedValueOnce(new Error('Error al iniciar sesión'));
  const alertSpy = jest.spyOn(Alert, 'alert');

  const { getByText } = render(<Login navigation={{ navigate: jest.fn() }} />);
  const loginButton = getByText('Inciar Sesion');

  fireEvent.press(loginButton);

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Error', 'Hubo un problema con el inicio de sesión.');
  });
});