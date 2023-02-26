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
  test('NotFoundPage mounts correctly', async () => {
    const wrapper = render(<NotFoundPage />);
    expect(wrapper).toContain("404!");
  });
});
