/**
 * Decorator context stubs required by TypeScript 5.x when `noLib: true` is set.
 * These types are normally provided by lib.decorators.d.ts but are absent in
 * roblox-ts builds that use @rbxts/compiler-types with noLib.
 *
 * These are only needed to satisfy the compiler — Flamework uses legacy
 * experimental decorators, not TC39 Stage 3 decorators.
 */

/* eslint-disable @typescript-eslint/no-empty-interface */

interface ClassDecoratorContext<
  Class extends abstract new (...args: never) => unknown = abstract new (...args: never) => unknown,
> {
  readonly kind: 'class';
  readonly name: string | undefined;
}

interface ClassMethodDecoratorContext<
  This = unknown,
  Value extends (this: This, ...args: never) => unknown = (this: This, ...args: never) => unknown,
> {
  readonly kind: 'method';
  readonly name: string | symbol;
  readonly static: boolean;
  readonly private: boolean;
}

interface ClassGetterDecoratorContext<This = unknown, Value = unknown> {
  readonly kind: 'getter';
  readonly name: string | symbol;
  readonly static: boolean;
  readonly private: boolean;
}

interface ClassSetterDecoratorContext<This = unknown, Value = unknown> {
  readonly kind: 'setter';
  readonly name: string | symbol;
  readonly static: boolean;
  readonly private: boolean;
}

interface ClassAccessorDecoratorContext<This = unknown, Value = unknown> {
  readonly kind: 'accessor';
  readonly name: string | symbol;
  readonly static: boolean;
  readonly private: boolean;
}

interface ClassFieldDecoratorContext<This = unknown, Value = unknown> {
  readonly kind: 'field';
  readonly name: string | symbol;
  readonly static: boolean;
  readonly private: boolean;
}

interface ClassAccessorDecoratorTarget<This, Value> {
  get(this: This): Value;
  set(this: This, value: Value): void;
}

interface ClassAccessorDecoratorResult<This, Value> {
  get?(this: This): Value;
  set?(this: This, value: Value): void;
  init?(this: This, value: Value): Value;
}

interface DecoratorContext {
  readonly kind: string;
  readonly name: string | symbol;
}

interface DecoratorMetadataObject {
  [key: PropertyKey]: unknown;
}

interface DecoratorMetadata {
  [key: PropertyKey]: unknown;
}
