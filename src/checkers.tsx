import { createRoot } from 'react-dom/client';

import { Lobby } from './lobby';

createRoot(document.getElementById('game')!).render(
    <Lobby />
  );
