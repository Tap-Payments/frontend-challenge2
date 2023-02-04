import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('<App />', () => {
  test('App mounts properly', async () => {
    const wrapper = render(<App />);
    expect(wrapper).toBeTruthy();
    expect(wrapper.getByText('Store')).toBeTruthy();

    const user = userEvent.setup();
    const store = vi.spyOn(user, 'click');
    const storeLink = screen.getByText(/Store/i);

    await user.click(storeLink);
    expect(store).toHaveBeenCalledTimes(1);
  });
});
