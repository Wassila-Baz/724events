import { render, fireEvent, screen } from '@testing-library/react';
import Menu from './index';

test('Clique sur "Nos services" redirige vers la section "Nos services"', () => {
  // Rendu du composant Menu
  render(<Menu />);
  
  // Clique sur le lien "Nos services"
  fireEvent.click(screen.getByText('Nos services'));

  // Vérifie que le hash de l'URL est mis à jour avec la section "Nos services"
  expect(window.location.hash).toBe('#nos-services');
});
