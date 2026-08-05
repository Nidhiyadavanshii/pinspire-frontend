// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { createUserPin, getAllPins } from './pinsStore';

describe('pinsStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists a newly created pin so it appears in the feed and profile', () => {
    const pin = createUserPin({
      title: 'My new pin',
      description: 'A fresh creation',
      category: 'Art',
      image: 'data:image/png;base64,abc123',
      user: 'you',
      userFullName: 'You',
      userId: 'me',
    });

    const allPins = getAllPins();

    expect(pin.id).toBeTruthy();
    expect(allPins.some((item) => item.id === pin.id)).toBe(true);
    expect(allPins.find((item) => item.id === pin.id)?.title).toBe('My new pin');
  });
});
