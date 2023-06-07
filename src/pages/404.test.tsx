import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import NotFoundPage from './404';

describe('<App />', () => {
  test('NotFoundPage mounts correctly', async () => {
    const wrapper = render(<NotFoundPage />);
    expect(wrapper).toBeTruthy();
  });
  // TODO: Add more tests
  // 1- to test the page container has PageNotFound class
  // 2- to test the page has an Error icon
  // 3- to test the page has a 404! text

  test('has PageNotFound class', () => {
    const { container } = render(<NotFoundPage />);
    expect(container.firstChild)
      .to.have.property('className')
      .that.includes('PageNotFound');
  });

  test('has Error icon', () => {
    const { getByTestId } = render(<NotFoundPage />);
    const errorIcon = getByTestId('ErrorIcon');
    expect(errorIcon).to.exist;
  });

  test('has 404! text', () => {
    const { getByText } = render(<NotFoundPage />);
    const textElement = getByText('404!');
    expect(textElement).to.exist;
  });
});
