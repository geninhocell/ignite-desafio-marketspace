import { AdvertContext } from '@contexts/AdvertContext';
import { useContext } from 'react';

export function useAdvert() {
  const context = useContext(AdvertContext);

  return context;
}
