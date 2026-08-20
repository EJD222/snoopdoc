import { render } from '@testing-library/react';

import SnoopdocUi from './ui';

describe('SnoopdocUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SnoopdocUi />);
    expect(baseElement).toBeTruthy();
  });
});
