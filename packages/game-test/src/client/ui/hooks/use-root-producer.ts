import { UseProducerHook, useProducer } from '@rbxts/react-reflex';
import type { RootProducer } from '../../store';

/**
 * Typed useProducer hook — provides access to all store actions.
 */
export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
