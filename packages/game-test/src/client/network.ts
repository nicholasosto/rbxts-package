/**
 * ClientNetwork — singleton for client-side Flamework networking.
 *
 * All controllers should import from here instead of calling
 * GlobalEvents.createClient() independently.
 */
import { GlobalEvents, GlobalFunctions } from '../shared/network';

export const clientEvents = GlobalEvents.createClient({});
export const clientFunctions = GlobalFunctions.createClient({});
