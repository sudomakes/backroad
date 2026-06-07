import { DOMAttributes } from 'react';

export const handleKeyUpBlur: DOMAttributes<HTMLInputElement>['onKeyUp'] = (
  event
) => {
  //key code for enter
  if (event.key === 'Enter') {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    inputElement.blur();
  }
};
