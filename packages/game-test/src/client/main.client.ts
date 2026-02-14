import { Flamework } from '@flamework/core';
import { Names } from '@nicholasosto/name-generator';

/**
 * Client entry point — Flamework ignition.
 * Add client-side Flamework controllers and components here.
 */
Flamework.addPaths('out/client');
Flamework.addPaths('out/shared');
Flamework.ignite();

print(`Generated name: ${Names.GenerateName({ type: 'FULL_MONIKER' })}`);
