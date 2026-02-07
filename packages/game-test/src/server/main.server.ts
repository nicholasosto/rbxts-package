import { Flamework } from '@flamework/core';

/**
 * Server entry point — Flamework ignition.
 * Add server-side Flamework services and components here.
 */
Flamework.addPaths('out/server');
Flamework.addPaths('out/shared');
Flamework.ignite();
