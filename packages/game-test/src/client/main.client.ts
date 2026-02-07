import { Flamework } from '@flamework/core';

/**
 * Client entry point — Flamework ignition.
 * Add client-side Flamework controllers and components here.
 */
Flamework.addPaths('out/client');
Flamework.addPaths('out/shared');
Flamework.ignite();
