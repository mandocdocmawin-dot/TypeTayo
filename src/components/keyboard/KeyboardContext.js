// components/keyboard/KeyboardContext.js
// Lets <Hands /> know which key is highlighted without the parent passing it twice.
import { createContext } from 'react';

export const KeyboardContext = createContext({ activeKey: null, shiftKey: null });