/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Account
 *
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>;
/**
 * Model AccountContact
 *
 */
export type AccountContact = $Result.DefaultSelection<Prisma.$AccountContactPayload>;
/**
 * Model AccountSubscription
 *
 */
export type AccountSubscription = $Result.DefaultSelection<Prisma.$AccountSubscriptionPayload>;
/**
 * Model AccountUser
 *
 */
export type AccountUser = $Result.DefaultSelection<Prisma.$AccountUserPayload>;
/**
 * Model AccountUserPermission
 *
 */
export type AccountUserPermission = $Result.DefaultSelection<Prisma.$AccountUserPermissionPayload>;
/**
 * Model Currency
 *
 */
export type Currency = $Result.DefaultSelection<Prisma.$CurrencyPayload>;
/**
 * Model DBSetting
 *
 */
export type DBSetting = $Result.DefaultSelection<Prisma.$DBSettingPayload>;
/**
 * Model File
 *
 */
export type File = $Result.DefaultSelection<Prisma.$FilePayload>;
/**
 * Model Permission
 *
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>;
/**
 * Model ProductionCompany
 *
 */
export type ProductionCompany = $Result.DefaultSelection<Prisma.$ProductionCompanyPayload>;
/**
 * Model SubscriptionPlan
 *
 */
export type SubscriptionPlan = $Result.DefaultSelection<Prisma.$SubscriptionPlanPayload>;
/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T
    ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<T['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: { maxWait?: number; timeout?: number; isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   */
  get account(): Prisma.AccountDelegate<ExtArgs>;

  /**
   * `prisma.accountContact`: Exposes CRUD operations for the **AccountContact** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AccountContacts
   * const accountContacts = await prisma.accountContact.findMany()
   * ```
   */
  get accountContact(): Prisma.AccountContactDelegate<ExtArgs>;

  /**
   * `prisma.accountSubscription`: Exposes CRUD operations for the **AccountSubscription** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AccountSubscriptions
   * const accountSubscriptions = await prisma.accountSubscription.findMany()
   * ```
   */
  get accountSubscription(): Prisma.AccountSubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.accountUser`: Exposes CRUD operations for the **AccountUser** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AccountUsers
   * const accountUsers = await prisma.accountUser.findMany()
   * ```
   */
  get accountUser(): Prisma.AccountUserDelegate<ExtArgs>;

  /**
   * `prisma.accountUserPermission`: Exposes CRUD operations for the **AccountUserPermission** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AccountUserPermissions
   * const accountUserPermissions = await prisma.accountUserPermission.findMany()
   * ```
   */
  get accountUserPermission(): Prisma.AccountUserPermissionDelegate<ExtArgs>;

  /**
   * `prisma.currency`: Exposes CRUD operations for the **Currency** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Currencies
   * const currencies = await prisma.currency.findMany()
   * ```
   */
  get currency(): Prisma.CurrencyDelegate<ExtArgs>;

  /**
   * `prisma.dBSetting`: Exposes CRUD operations for the **DBSetting** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more DBSettings
   * const dBSettings = await prisma.dBSetting.findMany()
   * ```
   */
  get dBSetting(): Prisma.DBSettingDelegate<ExtArgs>;

  /**
   * `prisma.file`: Exposes CRUD operations for the **File** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Files
   * const files = await prisma.file.findMany()
   * ```
   */
  get file(): Prisma.FileDelegate<ExtArgs>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Permissions
   * const permissions = await prisma.permission.findMany()
   * ```
   */
  get permission(): Prisma.PermissionDelegate<ExtArgs>;

  /**
   * `prisma.productionCompany`: Exposes CRUD operations for the **ProductionCompany** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProductionCompanies
   * const productionCompanies = await prisma.productionCompany.findMany()
   * ```
   */
  get productionCompany(): Prisma.ProductionCompanyDelegate<ExtArgs>;

  /**
   * `prisma.subscriptionPlan`: Exposes CRUD operations for the **SubscriptionPlan** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SubscriptionPlans
   * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
   * ```
   */
  get subscriptionPlan(): Prisma.SubscriptionPlanDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  export import NotFoundError = runtime.NotFoundError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 5.13.0
   * Query Engine version: b9a39a7ee606c28e3455d0fd60e78c3ba82b1a2b
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
   */
  export type JsonObject = { [Key in string]?: JsonValue };

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = { readonly [Key in string]?: InputJsonValue | null };

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown };

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
    ? 'Please either choose `select` or `omit`.'
    : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object ? (U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U) : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
    ? False
    : T extends Date
    ? False
    : T extends Uint8Array
    ? False
    : T extends BigInt
    ? False
    : T extends object
    ? True
    : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ? (K extends keyof O ? { [P in K]: O[P] } & O : O) | ({ [P in keyof O as P extends K ? K : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;

  export const ModelName: {
    Account: 'Account';
    AccountContact: 'AccountContact';
    AccountSubscription: 'AccountSubscription';
    AccountUser: 'AccountUser';
    AccountUserPermission: 'AccountUserPermission';
    Currency: 'Currency';
    DBSetting: 'DBSetting';
    File: 'File';
    Permission: 'Permission';
    ProductionCompany: 'ProductionCompany';
    SubscriptionPlan: 'SubscriptionPlan';
    User: 'User';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb extends $Utils.Fn<{ extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>;
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps:
        | 'account'
        | 'accountContact'
        | 'accountSubscription'
        | 'accountUser'
        | 'accountUserPermission'
        | 'currency'
        | 'dBSetting'
        | 'file'
        | 'permission'
        | 'productionCompany'
        | 'subscriptionPlan'
        | 'user';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>;
        fields: Prisma.AccountFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccount>;
          };
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountCountAggregateOutputType> | number;
          };
        };
      };
      AccountContact: {
        payload: Prisma.$AccountContactPayload<ExtArgs>;
        fields: Prisma.AccountContactFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountContactFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountContactFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload>;
          };
          findFirst: {
            args: Prisma.AccountContactFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountContactFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload>;
          };
          findMany: {
            args: Prisma.AccountContactFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload>[];
          };
          create: {
            args: Prisma.AccountContactCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload>;
          };
          createMany: {
            args: Prisma.AccountContactCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.AccountContactDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload>;
          };
          update: {
            args: Prisma.AccountContactUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload>;
          };
          deleteMany: {
            args: Prisma.AccountContactDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountContactUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.AccountContactUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountContactPayload>;
          };
          aggregate: {
            args: Prisma.AccountContactAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccountContact>;
          };
          groupBy: {
            args: Prisma.AccountContactGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountContactGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountContactCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountContactCountAggregateOutputType> | number;
          };
        };
      };
      AccountSubscription: {
        payload: Prisma.$AccountSubscriptionPayload<ExtArgs>;
        fields: Prisma.AccountSubscriptionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountSubscriptionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountSubscriptionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload>;
          };
          findFirst: {
            args: Prisma.AccountSubscriptionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountSubscriptionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload>;
          };
          findMany: {
            args: Prisma.AccountSubscriptionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload>[];
          };
          create: {
            args: Prisma.AccountSubscriptionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload>;
          };
          createMany: {
            args: Prisma.AccountSubscriptionCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.AccountSubscriptionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload>;
          };
          update: {
            args: Prisma.AccountSubscriptionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload>;
          };
          deleteMany: {
            args: Prisma.AccountSubscriptionDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountSubscriptionUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.AccountSubscriptionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountSubscriptionPayload>;
          };
          aggregate: {
            args: Prisma.AccountSubscriptionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccountSubscription>;
          };
          groupBy: {
            args: Prisma.AccountSubscriptionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountSubscriptionGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountSubscriptionCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountSubscriptionCountAggregateOutputType> | number;
          };
        };
      };
      AccountUser: {
        payload: Prisma.$AccountUserPayload<ExtArgs>;
        fields: Prisma.AccountUserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountUserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountUserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload>;
          };
          findFirst: {
            args: Prisma.AccountUserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountUserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload>;
          };
          findMany: {
            args: Prisma.AccountUserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload>[];
          };
          create: {
            args: Prisma.AccountUserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload>;
          };
          createMany: {
            args: Prisma.AccountUserCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.AccountUserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload>;
          };
          update: {
            args: Prisma.AccountUserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload>;
          };
          deleteMany: {
            args: Prisma.AccountUserDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountUserUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.AccountUserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPayload>;
          };
          aggregate: {
            args: Prisma.AccountUserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccountUser>;
          };
          groupBy: {
            args: Prisma.AccountUserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountUserGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountUserCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountUserCountAggregateOutputType> | number;
          };
        };
      };
      AccountUserPermission: {
        payload: Prisma.$AccountUserPermissionPayload<ExtArgs>;
        fields: Prisma.AccountUserPermissionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountUserPermissionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountUserPermissionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload>;
          };
          findFirst: {
            args: Prisma.AccountUserPermissionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountUserPermissionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload>;
          };
          findMany: {
            args: Prisma.AccountUserPermissionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload>[];
          };
          create: {
            args: Prisma.AccountUserPermissionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload>;
          };
          createMany: {
            args: Prisma.AccountUserPermissionCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.AccountUserPermissionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload>;
          };
          update: {
            args: Prisma.AccountUserPermissionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload>;
          };
          deleteMany: {
            args: Prisma.AccountUserPermissionDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountUserPermissionUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.AccountUserPermissionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountUserPermissionPayload>;
          };
          aggregate: {
            args: Prisma.AccountUserPermissionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccountUserPermission>;
          };
          groupBy: {
            args: Prisma.AccountUserPermissionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountUserPermissionGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountUserPermissionCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountUserPermissionCountAggregateOutputType> | number;
          };
        };
      };
      Currency: {
        payload: Prisma.$CurrencyPayload<ExtArgs>;
        fields: Prisma.CurrencyFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CurrencyFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CurrencyFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>;
          };
          findFirst: {
            args: Prisma.CurrencyFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CurrencyFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>;
          };
          findMany: {
            args: Prisma.CurrencyFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>[];
          };
          create: {
            args: Prisma.CurrencyCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>;
          };
          createMany: {
            args: Prisma.CurrencyCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.CurrencyDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>;
          };
          update: {
            args: Prisma.CurrencyUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>;
          };
          deleteMany: {
            args: Prisma.CurrencyDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.CurrencyUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.CurrencyUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CurrencyPayload>;
          };
          aggregate: {
            args: Prisma.CurrencyAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCurrency>;
          };
          groupBy: {
            args: Prisma.CurrencyGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CurrencyGroupByOutputType>[];
          };
          count: {
            args: Prisma.CurrencyCountArgs<ExtArgs>;
            result: $Utils.Optional<CurrencyCountAggregateOutputType> | number;
          };
        };
      };
      DBSetting: {
        payload: Prisma.$DBSettingPayload<ExtArgs>;
        fields: Prisma.DBSettingFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.DBSettingFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.DBSettingFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload>;
          };
          findFirst: {
            args: Prisma.DBSettingFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.DBSettingFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload>;
          };
          findMany: {
            args: Prisma.DBSettingFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload>[];
          };
          create: {
            args: Prisma.DBSettingCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload>;
          };
          createMany: {
            args: Prisma.DBSettingCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.DBSettingDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload>;
          };
          update: {
            args: Prisma.DBSettingUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload>;
          };
          deleteMany: {
            args: Prisma.DBSettingDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.DBSettingUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.DBSettingUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$DBSettingPayload>;
          };
          aggregate: {
            args: Prisma.DBSettingAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateDBSetting>;
          };
          groupBy: {
            args: Prisma.DBSettingGroupByArgs<ExtArgs>;
            result: $Utils.Optional<DBSettingGroupByOutputType>[];
          };
          count: {
            args: Prisma.DBSettingCountArgs<ExtArgs>;
            result: $Utils.Optional<DBSettingCountAggregateOutputType> | number;
          };
        };
      };
      File: {
        payload: Prisma.$FilePayload<ExtArgs>;
        fields: Prisma.FileFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.FileFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.FileFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload>;
          };
          findFirst: {
            args: Prisma.FileFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.FileFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload>;
          };
          findMany: {
            args: Prisma.FileFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[];
          };
          create: {
            args: Prisma.FileCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload>;
          };
          createMany: {
            args: Prisma.FileCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.FileDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload>;
          };
          update: {
            args: Prisma.FileUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload>;
          };
          deleteMany: {
            args: Prisma.FileDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.FileUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.FileUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FilePayload>;
          };
          aggregate: {
            args: Prisma.FileAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateFile>;
          };
          groupBy: {
            args: Prisma.FileGroupByArgs<ExtArgs>;
            result: $Utils.Optional<FileGroupByOutputType>[];
          };
          count: {
            args: Prisma.FileCountArgs<ExtArgs>;
            result: $Utils.Optional<FileCountAggregateOutputType> | number;
          };
        };
      };
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>;
        fields: Prisma.PermissionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>;
          };
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>;
          };
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[];
          };
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>;
          };
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>;
          };
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>;
          };
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>;
          };
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePermission>;
          };
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PermissionGroupByOutputType>[];
          };
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>;
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number;
          };
        };
      };
      ProductionCompany: {
        payload: Prisma.$ProductionCompanyPayload<ExtArgs>;
        fields: Prisma.ProductionCompanyFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProductionCompanyFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProductionCompanyFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload>;
          };
          findFirst: {
            args: Prisma.ProductionCompanyFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProductionCompanyFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload>;
          };
          findMany: {
            args: Prisma.ProductionCompanyFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload>[];
          };
          create: {
            args: Prisma.ProductionCompanyCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload>;
          };
          createMany: {
            args: Prisma.ProductionCompanyCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.ProductionCompanyDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload>;
          };
          update: {
            args: Prisma.ProductionCompanyUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload>;
          };
          deleteMany: {
            args: Prisma.ProductionCompanyDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.ProductionCompanyUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.ProductionCompanyUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductionCompanyPayload>;
          };
          aggregate: {
            args: Prisma.ProductionCompanyAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProductionCompany>;
          };
          groupBy: {
            args: Prisma.ProductionCompanyGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProductionCompanyGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProductionCompanyCountArgs<ExtArgs>;
            result: $Utils.Optional<ProductionCompanyCountAggregateOutputType> | number;
          };
        };
      };
      SubscriptionPlan: {
        payload: Prisma.$SubscriptionPlanPayload<ExtArgs>;
        fields: Prisma.SubscriptionPlanFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPlanFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>;
          };
          findFirst: {
            args: Prisma.SubscriptionPlanFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>;
          };
          findMany: {
            args: Prisma.SubscriptionPlanFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[];
          };
          create: {
            args: Prisma.SubscriptionPlanCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>;
          };
          createMany: {
            args: Prisma.SubscriptionPlanCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.SubscriptionPlanDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>;
          };
          update: {
            args: Prisma.SubscriptionPlanUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>;
          };
          deleteMany: {
            args: Prisma.SubscriptionPlanDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.SubscriptionPlanUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.SubscriptionPlanUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>;
          };
          aggregate: {
            args: Prisma.SubscriptionPlanAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSubscriptionPlan>;
          };
          groupBy: {
            args: Prisma.SubscriptionPlanGroupByArgs<ExtArgs>;
            result: $Utils.Optional<SubscriptionPlanGroupByOutputType>[];
          };
          count: {
            args: Prisma.SubscriptionPlanCountArgs<ExtArgs>;
            result: $Utils.Optional<SubscriptionPlanCountAggregateOutputType> | number;
          };
        };
      };
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: Prisma.BatchPayload;
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition
    ? T['emit'] extends 'event'
      ? T['level']
      : never
    : never;
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type AccountCountOutputType
   */

  export type AccountCountOutputType = {
    AccountContact: number;
    AccountSubscription: number;
    AccountUser: number;
    ProductionCompany: number;
  };

  export type AccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AccountContact?: boolean | AccountCountOutputTypeCountAccountContactArgs;
    AccountSubscription?: boolean | AccountCountOutputTypeCountAccountSubscriptionArgs;
    AccountUser?: boolean | AccountCountOutputTypeCountAccountUserArgs;
    ProductionCompany?: boolean | AccountCountOutputTypeCountProductionCompanyArgs;
  };

  // Custom InputTypes
  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCountOutputType
     */
    select?: AccountCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountAccountContactArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountContactWhereInput;
  };

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountAccountSubscriptionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountSubscriptionWhereInput;
  };

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountAccountUserArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountUserWhereInput;
  };

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountProductionCompanyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProductionCompanyWhereInput;
  };

  /**
   * Count Type AccountUserCountOutputType
   */

  export type AccountUserCountOutputType = {
    AccountUserPermission: number;
  };

  export type AccountUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AccountUserPermission?: boolean | AccountUserCountOutputTypeCountAccountUserPermissionArgs;
  };

  // Custom InputTypes
  /**
   * AccountUserCountOutputType without action
   */
  export type AccountUserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AccountUserCountOutputType
     */
    select?: AccountUserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AccountUserCountOutputType without action
   */
  export type AccountUserCountOutputTypeCountAccountUserPermissionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountUserPermissionWhereInput;
  };

  /**
   * Count Type CurrencyCountOutputType
   */

  export type CurrencyCountOutputType = {
    Account: number;
  };

  export type CurrencyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | CurrencyCountOutputTypeCountAccountArgs;
  };

  // Custom InputTypes
  /**
   * CurrencyCountOutputType without action
   */
  export type CurrencyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CurrencyCountOutputType
     */
    select?: CurrencyCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CurrencyCountOutputType without action
   */
  export type CurrencyCountOutputTypeCountAccountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountWhereInput;
  };

  /**
   * Count Type FileCountOutputType
   */

  export type FileCountOutputType = {
    Account: number;
    ProductionCompany: number;
  };

  export type FileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | FileCountOutputTypeCountAccountArgs;
    ProductionCompany?: boolean | FileCountOutputTypeCountProductionCompanyArgs;
  };

  // Custom InputTypes
  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileCountOutputType
     */
    select?: FileCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: AccountWhereInput;
    };

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountProductionCompanyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProductionCompanyWhereInput;
  };

  /**
   * Count Type PermissionCountOutputType
   */

  export type PermissionCountOutputType = {
    AccountUserPermission: number;
  };

  export type PermissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AccountUserPermission?: boolean | PermissionCountOutputTypeCountAccountUserPermissionArgs;
  };

  // Custom InputTypes
  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the PermissionCountOutputType
       */
      select?: PermissionCountOutputTypeSelect<ExtArgs> | null;
    };

  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeCountAccountUserPermissionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountUserPermissionWhereInput;
  };

  /**
   * Count Type SubscriptionPlanCountOutputType
   */

  export type SubscriptionPlanCountOutputType = {
    AccountSubscription: number;
  };

  export type SubscriptionPlanCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    AccountSubscription?: boolean | SubscriptionPlanCountOutputTypeCountAccountSubscriptionArgs;
  };

  // Custom InputTypes
  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanCountOutputType
     */
    select?: SubscriptionPlanCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeCountAccountSubscriptionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountSubscriptionWhereInput;
  };

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    File: number;
  };

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    File?: boolean | UserCountOutputTypeCountFileArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  export type AccountAvgAggregateOutputType = {
    AccountId: number | null;
    AccountLogoFileId: number | null;
    AccountNumPeople: number | null;
  };

  export type AccountSumAggregateOutputType = {
    AccountId: number | null;
    AccountLogoFileId: number | null;
    AccountNumPeople: number | null;
  };

  export type AccountMinAggregateOutputType = {
    AccountId: number | null;
    AccountName: string | null;
    AccountAddress1: string | null;
    AccountAddress2: string | null;
    AccountAddress3: string | null;
    AccountAddressTown: string | null;
    AccountAddressCounty: string | null;
    AccountAddressPostcode: string | null;
    AccountAddressCountry: string | null;
    AccountVATNumber: string | null;
    AccountCurrencyCode: string | null;
    AccountCompanyNumber: string | null;
    AccountLogoFileId: number | null;
    AccountMainEmail: string | null;
    AccountNumPeople: number | null;
    AccountOrganisationId: string | null;
    AccountTermsAgreedBy: string | null;
    AccountTermsAgreedDate: Date | null;
    AccountWebsite: string | null;
    AccountTypeOfCompany: string | null;
    AccountPhone: string | null;
    AccountPaymentCurrencyCode: string | null;
  };

  export type AccountMaxAggregateOutputType = {
    AccountId: number | null;
    AccountName: string | null;
    AccountAddress1: string | null;
    AccountAddress2: string | null;
    AccountAddress3: string | null;
    AccountAddressTown: string | null;
    AccountAddressCounty: string | null;
    AccountAddressPostcode: string | null;
    AccountAddressCountry: string | null;
    AccountVATNumber: string | null;
    AccountCurrencyCode: string | null;
    AccountCompanyNumber: string | null;
    AccountLogoFileId: number | null;
    AccountMainEmail: string | null;
    AccountNumPeople: number | null;
    AccountOrganisationId: string | null;
    AccountTermsAgreedBy: string | null;
    AccountTermsAgreedDate: Date | null;
    AccountWebsite: string | null;
    AccountTypeOfCompany: string | null;
    AccountPhone: string | null;
    AccountPaymentCurrencyCode: string | null;
  };

  export type AccountCountAggregateOutputType = {
    AccountId: number;
    AccountName: number;
    AccountAddress1: number;
    AccountAddress2: number;
    AccountAddress3: number;
    AccountAddressTown: number;
    AccountAddressCounty: number;
    AccountAddressPostcode: number;
    AccountAddressCountry: number;
    AccountVATNumber: number;
    AccountCurrencyCode: number;
    AccountCompanyNumber: number;
    AccountLogoFileId: number;
    AccountMainEmail: number;
    AccountNumPeople: number;
    AccountOrganisationId: number;
    AccountTermsAgreedBy: number;
    AccountTermsAgreedDate: number;
    AccountWebsite: number;
    AccountTypeOfCompany: number;
    AccountPhone: number;
    AccountPaymentCurrencyCode: number;
    _all: number;
  };

  export type AccountAvgAggregateInputType = {
    AccountId?: true;
    AccountLogoFileId?: true;
    AccountNumPeople?: true;
  };

  export type AccountSumAggregateInputType = {
    AccountId?: true;
    AccountLogoFileId?: true;
    AccountNumPeople?: true;
  };

  export type AccountMinAggregateInputType = {
    AccountId?: true;
    AccountName?: true;
    AccountAddress1?: true;
    AccountAddress2?: true;
    AccountAddress3?: true;
    AccountAddressTown?: true;
    AccountAddressCounty?: true;
    AccountAddressPostcode?: true;
    AccountAddressCountry?: true;
    AccountVATNumber?: true;
    AccountCurrencyCode?: true;
    AccountCompanyNumber?: true;
    AccountLogoFileId?: true;
    AccountMainEmail?: true;
    AccountNumPeople?: true;
    AccountOrganisationId?: true;
    AccountTermsAgreedBy?: true;
    AccountTermsAgreedDate?: true;
    AccountWebsite?: true;
    AccountTypeOfCompany?: true;
    AccountPhone?: true;
    AccountPaymentCurrencyCode?: true;
  };

  export type AccountMaxAggregateInputType = {
    AccountId?: true;
    AccountName?: true;
    AccountAddress1?: true;
    AccountAddress2?: true;
    AccountAddress3?: true;
    AccountAddressTown?: true;
    AccountAddressCounty?: true;
    AccountAddressPostcode?: true;
    AccountAddressCountry?: true;
    AccountVATNumber?: true;
    AccountCurrencyCode?: true;
    AccountCompanyNumber?: true;
    AccountLogoFileId?: true;
    AccountMainEmail?: true;
    AccountNumPeople?: true;
    AccountOrganisationId?: true;
    AccountTermsAgreedBy?: true;
    AccountTermsAgreedDate?: true;
    AccountWebsite?: true;
    AccountTypeOfCompany?: true;
    AccountPhone?: true;
    AccountPaymentCurrencyCode?: true;
  };

  export type AccountCountAggregateInputType = {
    AccountId?: true;
    AccountName?: true;
    AccountAddress1?: true;
    AccountAddress2?: true;
    AccountAddress3?: true;
    AccountAddressTown?: true;
    AccountAddressCounty?: true;
    AccountAddressPostcode?: true;
    AccountAddressCountry?: true;
    AccountVATNumber?: true;
    AccountCurrencyCode?: true;
    AccountCompanyNumber?: true;
    AccountLogoFileId?: true;
    AccountMainEmail?: true;
    AccountNumPeople?: true;
    AccountOrganisationId?: true;
    AccountTermsAgreedBy?: true;
    AccountTermsAgreedDate?: true;
    AccountWebsite?: true;
    AccountTypeOfCompany?: true;
    AccountPhone?: true;
    AccountPaymentCurrencyCode?: true;
    _all?: true;
  };

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Accounts
     **/
    _count?: true | AccountCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AccountAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AccountSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AccountMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AccountMaxAggregateInputType;
  };

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>;
  };

  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput;
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[];
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum;
    having?: AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInputType | true;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
  };

  export type AccountGroupByOutputType = {
    AccountId: number;
    AccountName: string;
    AccountAddress1: string | null;
    AccountAddress2: string | null;
    AccountAddress3: string | null;
    AccountAddressTown: string | null;
    AccountAddressCounty: string | null;
    AccountAddressPostcode: string | null;
    AccountAddressCountry: string | null;
    AccountVATNumber: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber: string | null;
    AccountLogoFileId: number | null;
    AccountMainEmail: string | null;
    AccountNumPeople: number | null;
    AccountOrganisationId: string | null;
    AccountTermsAgreedBy: string | null;
    AccountTermsAgreedDate: Date | null;
    AccountWebsite: string | null;
    AccountTypeOfCompany: string | null;
    AccountPhone: string | null;
    AccountPaymentCurrencyCode: string | null;
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AccountGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
          : GetScalarType<T[P], AccountGroupByOutputType[P]>;
      }
    >
  >;

  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
    {
      AccountId?: boolean;
      AccountName?: boolean;
      AccountAddress1?: boolean;
      AccountAddress2?: boolean;
      AccountAddress3?: boolean;
      AccountAddressTown?: boolean;
      AccountAddressCounty?: boolean;
      AccountAddressPostcode?: boolean;
      AccountAddressCountry?: boolean;
      AccountVATNumber?: boolean;
      AccountCurrencyCode?: boolean;
      AccountCompanyNumber?: boolean;
      AccountLogoFileId?: boolean;
      AccountMainEmail?: boolean;
      AccountNumPeople?: boolean;
      AccountOrganisationId?: boolean;
      AccountTermsAgreedBy?: boolean;
      AccountTermsAgreedDate?: boolean;
      AccountWebsite?: boolean;
      AccountTypeOfCompany?: boolean;
      AccountPhone?: boolean;
      AccountPaymentCurrencyCode?: boolean;
      Currency?: boolean | Account$CurrencyArgs<ExtArgs>;
      File?: boolean | Account$FileArgs<ExtArgs>;
      AccountContact?: boolean | Account$AccountContactArgs<ExtArgs>;
      AccountSubscription?: boolean | Account$AccountSubscriptionArgs<ExtArgs>;
      AccountUser?: boolean | Account$AccountUserArgs<ExtArgs>;
      ProductionCompany?: boolean | Account$ProductionCompanyArgs<ExtArgs>;
      _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['account']
  >;

  export type AccountSelectScalar = {
    AccountId?: boolean;
    AccountName?: boolean;
    AccountAddress1?: boolean;
    AccountAddress2?: boolean;
    AccountAddress3?: boolean;
    AccountAddressTown?: boolean;
    AccountAddressCounty?: boolean;
    AccountAddressPostcode?: boolean;
    AccountAddressCountry?: boolean;
    AccountVATNumber?: boolean;
    AccountCurrencyCode?: boolean;
    AccountCompanyNumber?: boolean;
    AccountLogoFileId?: boolean;
    AccountMainEmail?: boolean;
    AccountNumPeople?: boolean;
    AccountOrganisationId?: boolean;
    AccountTermsAgreedBy?: boolean;
    AccountTermsAgreedDate?: boolean;
    AccountWebsite?: boolean;
    AccountTypeOfCompany?: boolean;
    AccountPhone?: boolean;
    AccountPaymentCurrencyCode?: boolean;
  };

  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Currency?: boolean | Account$CurrencyArgs<ExtArgs>;
    File?: boolean | Account$FileArgs<ExtArgs>;
    AccountContact?: boolean | Account$AccountContactArgs<ExtArgs>;
    AccountSubscription?: boolean | Account$AccountSubscriptionArgs<ExtArgs>;
    AccountUser?: boolean | Account$AccountUserArgs<ExtArgs>;
    ProductionCompany?: boolean | Account$ProductionCompanyArgs<ExtArgs>;
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Account';
    objects: {
      Currency: Prisma.$CurrencyPayload<ExtArgs> | null;
      File: Prisma.$FilePayload<ExtArgs> | null;
      AccountContact: Prisma.$AccountContactPayload<ExtArgs>[];
      AccountSubscription: Prisma.$AccountSubscriptionPayload<ExtArgs>[];
      AccountUser: Prisma.$AccountUserPayload<ExtArgs>[];
      ProductionCompany: Prisma.$ProductionCompanyPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        AccountId: number;
        AccountName: string;
        AccountAddress1: string | null;
        AccountAddress2: string | null;
        AccountAddress3: string | null;
        AccountAddressTown: string | null;
        AccountAddressCounty: string | null;
        AccountAddressPostcode: string | null;
        AccountAddressCountry: string | null;
        AccountVATNumber: string | null;
        AccountCurrencyCode: string;
        AccountCompanyNumber: string | null;
        AccountLogoFileId: number | null;
        AccountMainEmail: string | null;
        AccountNumPeople: number | null;
        AccountOrganisationId: string | null;
        AccountTermsAgreedBy: string | null;
        AccountTermsAgreedDate: Date | null;
        AccountWebsite: string | null;
        AccountTypeOfCompany: string | null;
        AccountPhone: string | null;
        AccountPaymentCurrencyCode: string | null;
      },
      ExtArgs['result']['account']
    >;
    composites: {};
  };

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<
    Prisma.$AccountPayload,
    S
  >;

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AccountFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: AccountCountAggregateInputType | true;
  };

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account']; meta: { name: 'Account' } };
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends AccountFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>,
    ): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>;

    /**
     * Find one Account that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends AccountFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>,
    ): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>;

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>;

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     *
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     *
     * // Only select the `AccountId`
     * const accountWithAccountIdOnly = await prisma.account.findMany({ select: { AccountId: true } })
     *
     **/
    findMany<T extends AccountFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     *
     **/
    create<T extends AccountCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountCreateArgs<ExtArgs>>,
    ): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'create'>, never, ExtArgs>;

    /**
     * Create many Accounts.
     *     @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     *     @example
     *     // Create many Accounts
     *     const account = await prisma.account.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends AccountCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     *
     **/
    delete<T extends AccountDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>,
    ): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>;

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends AccountUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>,
    ): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'update'>, never, ExtArgs>;

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends AccountDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends AccountUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     **/
    upsert<T extends AccountUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>,
    ): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>;

    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
     **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AccountAggregateArgs>(
      args: Subset<T, AccountAggregateArgs>,
    ): Prisma.PrismaPromise<GetAccountAggregateType<T>>;

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Account model
     */
    readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    Currency<T extends Account$CurrencyArgs<ExtArgs> = {}>(
      args?: Subset<T, Account$CurrencyArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<
      $Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null,
      null,
      ExtArgs
    >;

    File<T extends Account$FileArgs<ExtArgs> = {}>(
      args?: Subset<T, Account$FileArgs<ExtArgs>>,
    ): Prisma__FileClient<
      $Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findUniqueOrThrow'> | null,
      null,
      ExtArgs
    >;

    AccountContact<T extends Account$AccountContactArgs<ExtArgs> = {}>(
      args?: Subset<T, Account$AccountContactArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'findMany'> | Null>;

    AccountSubscription<T extends Account$AccountSubscriptionArgs<ExtArgs> = {}>(
      args?: Subset<T, Account$AccountSubscriptionArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'findMany'> | Null>;

    AccountUser<T extends Account$AccountUserArgs<ExtArgs> = {}>(
      args?: Subset<T, Account$AccountUserArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findMany'> | Null>;

    ProductionCompany<T extends Account$ProductionCompanyArgs<ExtArgs> = {}>(
      args?: Subset<T, Account$ProductionCompanyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly AccountId: FieldRef<'Account', 'Int'>;
    readonly AccountName: FieldRef<'Account', 'String'>;
    readonly AccountAddress1: FieldRef<'Account', 'String'>;
    readonly AccountAddress2: FieldRef<'Account', 'String'>;
    readonly AccountAddress3: FieldRef<'Account', 'String'>;
    readonly AccountAddressTown: FieldRef<'Account', 'String'>;
    readonly AccountAddressCounty: FieldRef<'Account', 'String'>;
    readonly AccountAddressPostcode: FieldRef<'Account', 'String'>;
    readonly AccountAddressCountry: FieldRef<'Account', 'String'>;
    readonly AccountVATNumber: FieldRef<'Account', 'String'>;
    readonly AccountCurrencyCode: FieldRef<'Account', 'String'>;
    readonly AccountCompanyNumber: FieldRef<'Account', 'String'>;
    readonly AccountLogoFileId: FieldRef<'Account', 'Int'>;
    readonly AccountMainEmail: FieldRef<'Account', 'String'>;
    readonly AccountNumPeople: FieldRef<'Account', 'Int'>;
    readonly AccountOrganisationId: FieldRef<'Account', 'String'>;
    readonly AccountTermsAgreedBy: FieldRef<'Account', 'String'>;
    readonly AccountTermsAgreedDate: FieldRef<'Account', 'DateTime'>;
    readonly AccountWebsite: FieldRef<'Account', 'String'>;
    readonly AccountTypeOfCompany: FieldRef<'Account', 'String'>;
    readonly AccountPhone: FieldRef<'Account', 'String'>;
    readonly AccountPaymentCurrencyCode: FieldRef<'Account', 'String'>;
  }

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
  };

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput;
  };

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput;
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
  };

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput;
  };

  /**
   * Account.Currency
   */
  export type Account$CurrencyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    where?: CurrencyWhereInput;
  };

  /**
   * Account.File
   */
  export type Account$FileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    where?: FileWhereInput;
  };

  /**
   * Account.AccountContact
   */
  export type Account$AccountContactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    where?: AccountContactWhereInput;
    orderBy?: AccountContactOrderByWithRelationInput | AccountContactOrderByWithRelationInput[];
    cursor?: AccountContactWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountContactScalarFieldEnum | AccountContactScalarFieldEnum[];
  };

  /**
   * Account.AccountSubscription
   */
  export type Account$AccountSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    where?: AccountSubscriptionWhereInput;
    orderBy?: AccountSubscriptionOrderByWithRelationInput | AccountSubscriptionOrderByWithRelationInput[];
    cursor?: AccountSubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountSubscriptionScalarFieldEnum | AccountSubscriptionScalarFieldEnum[];
  };

  /**
   * Account.AccountUser
   */
  export type Account$AccountUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    where?: AccountUserWhereInput;
    orderBy?: AccountUserOrderByWithRelationInput | AccountUserOrderByWithRelationInput[];
    cursor?: AccountUserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountUserScalarFieldEnum | AccountUserScalarFieldEnum[];
  };

  /**
   * Account.ProductionCompany
   */
  export type Account$ProductionCompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    where?: ProductionCompanyWhereInput;
    orderBy?: ProductionCompanyOrderByWithRelationInput | ProductionCompanyOrderByWithRelationInput[];
    cursor?: ProductionCompanyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ProductionCompanyScalarFieldEnum | ProductionCompanyScalarFieldEnum[];
  };

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
  };

  /**
   * Model AccountContact
   */

  export type AggregateAccountContact = {
    _count: AccountContactCountAggregateOutputType | null;
    _avg: AccountContactAvgAggregateOutputType | null;
    _sum: AccountContactSumAggregateOutputType | null;
    _min: AccountContactMinAggregateOutputType | null;
    _max: AccountContactMaxAggregateOutputType | null;
  };

  export type AccountContactAvgAggregateOutputType = {
    AccContId: number | null;
    AccContAccountId: number | null;
  };

  export type AccountContactSumAggregateOutputType = {
    AccContId: number | null;
    AccContAccountId: number | null;
  };

  export type AccountContactMinAggregateOutputType = {
    AccContId: number | null;
    AccContAccountId: number | null;
    AccContFirstName: string | null;
    AccContLastName: string | null;
    AccContPhone: string | null;
    AccContMainEmail: string | null;
  };

  export type AccountContactMaxAggregateOutputType = {
    AccContId: number | null;
    AccContAccountId: number | null;
    AccContFirstName: string | null;
    AccContLastName: string | null;
    AccContPhone: string | null;
    AccContMainEmail: string | null;
  };

  export type AccountContactCountAggregateOutputType = {
    AccContId: number;
    AccContAccountId: number;
    AccContFirstName: number;
    AccContLastName: number;
    AccContPhone: number;
    AccContMainEmail: number;
    _all: number;
  };

  export type AccountContactAvgAggregateInputType = {
    AccContId?: true;
    AccContAccountId?: true;
  };

  export type AccountContactSumAggregateInputType = {
    AccContId?: true;
    AccContAccountId?: true;
  };

  export type AccountContactMinAggregateInputType = {
    AccContId?: true;
    AccContAccountId?: true;
    AccContFirstName?: true;
    AccContLastName?: true;
    AccContPhone?: true;
    AccContMainEmail?: true;
  };

  export type AccountContactMaxAggregateInputType = {
    AccContId?: true;
    AccContAccountId?: true;
    AccContFirstName?: true;
    AccContLastName?: true;
    AccContPhone?: true;
    AccContMainEmail?: true;
  };

  export type AccountContactCountAggregateInputType = {
    AccContId?: true;
    AccContAccountId?: true;
    AccContFirstName?: true;
    AccContLastName?: true;
    AccContPhone?: true;
    AccContMainEmail?: true;
    _all?: true;
  };

  export type AccountContactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountContact to aggregate.
     */
    where?: AccountContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountContacts to fetch.
     */
    orderBy?: AccountContactOrderByWithRelationInput | AccountContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountContacts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AccountContacts
     **/
    _count?: true | AccountContactCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AccountContactAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AccountContactSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AccountContactMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AccountContactMaxAggregateInputType;
  };

  export type GetAccountContactAggregateType<T extends AccountContactAggregateArgs> = {
    [P in keyof T & keyof AggregateAccountContact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountContact[P]>
      : GetScalarType<T[P], AggregateAccountContact[P]>;
  };

  export type AccountContactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountContactWhereInput;
    orderBy?: AccountContactOrderByWithAggregationInput | AccountContactOrderByWithAggregationInput[];
    by: AccountContactScalarFieldEnum[] | AccountContactScalarFieldEnum;
    having?: AccountContactScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountContactCountAggregateInputType | true;
    _avg?: AccountContactAvgAggregateInputType;
    _sum?: AccountContactSumAggregateInputType;
    _min?: AccountContactMinAggregateInputType;
    _max?: AccountContactMaxAggregateInputType;
  };

  export type AccountContactGroupByOutputType = {
    AccContId: number;
    AccContAccountId: number;
    AccContFirstName: string;
    AccContLastName: string | null;
    AccContPhone: string | null;
    AccContMainEmail: string | null;
    _count: AccountContactCountAggregateOutputType | null;
    _avg: AccountContactAvgAggregateOutputType | null;
    _sum: AccountContactSumAggregateOutputType | null;
    _min: AccountContactMinAggregateOutputType | null;
    _max: AccountContactMaxAggregateOutputType | null;
  };

  type GetAccountContactGroupByPayload<T extends AccountContactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountContactGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AccountContactGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AccountContactGroupByOutputType[P]>
          : GetScalarType<T[P], AccountContactGroupByOutputType[P]>;
      }
    >
  >;

  export type AccountContactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        AccContId?: boolean;
        AccContAccountId?: boolean;
        AccContFirstName?: boolean;
        AccContLastName?: boolean;
        AccContPhone?: boolean;
        AccContMainEmail?: boolean;
        Account?: boolean | AccountDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['accountContact']
    >;

  export type AccountContactSelectScalar = {
    AccContId?: boolean;
    AccContAccountId?: boolean;
    AccContFirstName?: boolean;
    AccContLastName?: boolean;
    AccContPhone?: boolean;
    AccContMainEmail?: boolean;
  };

  export type AccountContactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | AccountDefaultArgs<ExtArgs>;
  };

  export type $AccountContactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'AccountContact';
    objects: {
      Account: Prisma.$AccountPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        AccContId: number;
        AccContAccountId: number;
        AccContFirstName: string;
        AccContLastName: string | null;
        AccContPhone: string | null;
        AccContMainEmail: string | null;
      },
      ExtArgs['result']['accountContact']
    >;
    composites: {};
  };

  type AccountContactGetPayload<S extends boolean | null | undefined | AccountContactDefaultArgs> = $Result.GetResult<
    Prisma.$AccountContactPayload,
    S
  >;

  type AccountContactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AccountContactFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: AccountContactCountAggregateInputType | true;
  };

  export interface AccountContactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccountContact']; meta: { name: 'AccountContact' } };
    /**
     * Find zero or one AccountContact that matches the filter.
     * @param {AccountContactFindUniqueArgs} args - Arguments to find a AccountContact
     * @example
     * // Get one AccountContact
     * const accountContact = await prisma.accountContact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends AccountContactFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AccountContactFindUniqueArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one AccountContact that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {AccountContactFindUniqueOrThrowArgs} args - Arguments to find a AccountContact
     * @example
     * // Get one AccountContact
     * const accountContact = await prisma.accountContact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends AccountContactFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountContactFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first AccountContact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountContactFindFirstArgs} args - Arguments to find a AccountContact
     * @example
     * // Get one AccountContact
     * const accountContact = await prisma.accountContact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends AccountContactFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountContactFindFirstArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first AccountContact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountContactFindFirstOrThrowArgs} args - Arguments to find a AccountContact
     * @example
     * // Get one AccountContact
     * const accountContact = await prisma.accountContact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends AccountContactFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountContactFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more AccountContacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountContactFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountContacts
     * const accountContacts = await prisma.accountContact.findMany()
     *
     * // Get first 10 AccountContacts
     * const accountContacts = await prisma.accountContact.findMany({ take: 10 })
     *
     * // Only select the `AccContId`
     * const accountContactWithAccContIdOnly = await prisma.accountContact.findMany({ select: { AccContId: true } })
     *
     **/
    findMany<T extends AccountContactFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountContactFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a AccountContact.
     * @param {AccountContactCreateArgs} args - Arguments to create a AccountContact.
     * @example
     * // Create one AccountContact
     * const AccountContact = await prisma.accountContact.create({
     *   data: {
     *     // ... data to create a AccountContact
     *   }
     * })
     *
     **/
    create<T extends AccountContactCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountContactCreateArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many AccountContacts.
     *     @param {AccountContactCreateManyArgs} args - Arguments to create many AccountContacts.
     *     @example
     *     // Create many AccountContacts
     *     const accountContact = await prisma.accountContact.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends AccountContactCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountContactCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a AccountContact.
     * @param {AccountContactDeleteArgs} args - Arguments to delete one AccountContact.
     * @example
     * // Delete one AccountContact
     * const AccountContact = await prisma.accountContact.delete({
     *   where: {
     *     // ... filter to delete one AccountContact
     *   }
     * })
     *
     **/
    delete<T extends AccountContactDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AccountContactDeleteArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one AccountContact.
     * @param {AccountContactUpdateArgs} args - Arguments to update one AccountContact.
     * @example
     * // Update one AccountContact
     * const accountContact = await prisma.accountContact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends AccountContactUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountContactUpdateArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more AccountContacts.
     * @param {AccountContactDeleteManyArgs} args - Arguments to filter AccountContacts to delete.
     * @example
     * // Delete a few AccountContacts
     * const { count } = await prisma.accountContact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends AccountContactDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountContactDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AccountContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountContactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountContacts
     * const accountContact = await prisma.accountContact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends AccountContactUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AccountContactUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AccountContact.
     * @param {AccountContactUpsertArgs} args - Arguments to update or create a AccountContact.
     * @example
     * // Update or create a AccountContact
     * const accountContact = await prisma.accountContact.upsert({
     *   create: {
     *     // ... data to create a AccountContact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountContact we want to update
     *   }
     * })
     **/
    upsert<T extends AccountContactUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AccountContactUpsertArgs<ExtArgs>>,
    ): Prisma__AccountContactClient<
      $Result.GetResult<Prisma.$AccountContactPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of AccountContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountContactCountArgs} args - Arguments to filter AccountContacts to count.
     * @example
     * // Count the number of AccountContacts
     * const count = await prisma.accountContact.count({
     *   where: {
     *     // ... the filter for the AccountContacts we want to count
     *   }
     * })
     **/
    count<T extends AccountContactCountArgs>(
      args?: Subset<T, AccountContactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountContactCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AccountContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountContactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AccountContactAggregateArgs>(
      args: Subset<T, AccountContactAggregateArgs>,
    ): Prisma.PrismaPromise<GetAccountContactAggregateType<T>>;

    /**
     * Group by AccountContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountContactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AccountContactGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountContactGroupByArgs['orderBy'] }
        : { orderBy?: AccountContactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountContactGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAccountContactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AccountContact model
     */
    readonly fields: AccountContactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountContact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountContactClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    Account<T extends AccountDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AccountDefaultArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AccountContact model
   */
  interface AccountContactFieldRefs {
    readonly AccContId: FieldRef<'AccountContact', 'Int'>;
    readonly AccContAccountId: FieldRef<'AccountContact', 'Int'>;
    readonly AccContFirstName: FieldRef<'AccountContact', 'String'>;
    readonly AccContLastName: FieldRef<'AccountContact', 'String'>;
    readonly AccContPhone: FieldRef<'AccountContact', 'String'>;
    readonly AccContMainEmail: FieldRef<'AccountContact', 'String'>;
  }

  // Custom InputTypes
  /**
   * AccountContact findUnique
   */
  export type AccountContactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * Filter, which AccountContact to fetch.
     */
    where: AccountContactWhereUniqueInput;
  };

  /**
   * AccountContact findUniqueOrThrow
   */
  export type AccountContactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AccountContact
       */
      select?: AccountContactSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountContactInclude<ExtArgs> | null;
      /**
       * Filter, which AccountContact to fetch.
       */
      where: AccountContactWhereUniqueInput;
    };

  /**
   * AccountContact findFirst
   */
  export type AccountContactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * Filter, which AccountContact to fetch.
     */
    where?: AccountContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountContacts to fetch.
     */
    orderBy?: AccountContactOrderByWithRelationInput | AccountContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountContacts.
     */
    cursor?: AccountContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountContacts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountContacts.
     */
    distinct?: AccountContactScalarFieldEnum | AccountContactScalarFieldEnum[];
  };

  /**
   * AccountContact findFirstOrThrow
   */
  export type AccountContactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * Filter, which AccountContact to fetch.
     */
    where?: AccountContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountContacts to fetch.
     */
    orderBy?: AccountContactOrderByWithRelationInput | AccountContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountContacts.
     */
    cursor?: AccountContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountContacts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountContacts.
     */
    distinct?: AccountContactScalarFieldEnum | AccountContactScalarFieldEnum[];
  };

  /**
   * AccountContact findMany
   */
  export type AccountContactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * Filter, which AccountContacts to fetch.
     */
    where?: AccountContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountContacts to fetch.
     */
    orderBy?: AccountContactOrderByWithRelationInput | AccountContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AccountContacts.
     */
    cursor?: AccountContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountContacts.
     */
    skip?: number;
    distinct?: AccountContactScalarFieldEnum | AccountContactScalarFieldEnum[];
  };

  /**
   * AccountContact create
   */
  export type AccountContactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * The data needed to create a AccountContact.
     */
    data: XOR<AccountContactCreateInput, AccountContactUncheckedCreateInput>;
  };

  /**
   * AccountContact createMany
   */
  export type AccountContactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccountContacts.
     */
    data: AccountContactCreateManyInput | AccountContactCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AccountContact update
   */
  export type AccountContactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * The data needed to update a AccountContact.
     */
    data: XOR<AccountContactUpdateInput, AccountContactUncheckedUpdateInput>;
    /**
     * Choose, which AccountContact to update.
     */
    where: AccountContactWhereUniqueInput;
  };

  /**
   * AccountContact updateMany
   */
  export type AccountContactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccountContacts.
     */
    data: XOR<AccountContactUpdateManyMutationInput, AccountContactUncheckedUpdateManyInput>;
    /**
     * Filter which AccountContacts to update
     */
    where?: AccountContactWhereInput;
  };

  /**
   * AccountContact upsert
   */
  export type AccountContactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * The filter to search for the AccountContact to update in case it exists.
     */
    where: AccountContactWhereUniqueInput;
    /**
     * In case the AccountContact found by the `where` argument doesn't exist, create a new AccountContact with this data.
     */
    create: XOR<AccountContactCreateInput, AccountContactUncheckedCreateInput>;
    /**
     * In case the AccountContact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountContactUpdateInput, AccountContactUncheckedUpdateInput>;
  };

  /**
   * AccountContact delete
   */
  export type AccountContactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
    /**
     * Filter which AccountContact to delete.
     */
    where: AccountContactWhereUniqueInput;
  };

  /**
   * AccountContact deleteMany
   */
  export type AccountContactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountContacts to delete
     */
    where?: AccountContactWhereInput;
  };

  /**
   * AccountContact without action
   */
  export type AccountContactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountContact
     */
    select?: AccountContactSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountContactInclude<ExtArgs> | null;
  };

  /**
   * Model AccountSubscription
   */

  export type AggregateAccountSubscription = {
    _count: AccountSubscriptionCountAggregateOutputType | null;
    _avg: AccountSubscriptionAvgAggregateOutputType | null;
    _sum: AccountSubscriptionSumAggregateOutputType | null;
    _min: AccountSubscriptionMinAggregateOutputType | null;
    _max: AccountSubscriptionMaxAggregateOutputType | null;
  };

  export type AccountSubscriptionAvgAggregateOutputType = {
    AccSubId: number | null;
    AccSubAccountId: number | null;
    AccSubPlanId: number | null;
  };

  export type AccountSubscriptionSumAggregateOutputType = {
    AccSubId: number | null;
    AccSubAccountId: number | null;
    AccSubPlanId: number | null;
  };

  export type AccountSubscriptionMinAggregateOutputType = {
    AccSubId: number | null;
    AccSubAccountId: number | null;
    AccSubPlanId: number | null;
    AccSubStartDate: Date | null;
    AccSubEndDate: Date | null;
    AccSubIsActive: boolean | null;
  };

  export type AccountSubscriptionMaxAggregateOutputType = {
    AccSubId: number | null;
    AccSubAccountId: number | null;
    AccSubPlanId: number | null;
    AccSubStartDate: Date | null;
    AccSubEndDate: Date | null;
    AccSubIsActive: boolean | null;
  };

  export type AccountSubscriptionCountAggregateOutputType = {
    AccSubId: number;
    AccSubAccountId: number;
    AccSubPlanId: number;
    AccSubStartDate: number;
    AccSubEndDate: number;
    AccSubIsActive: number;
    _all: number;
  };

  export type AccountSubscriptionAvgAggregateInputType = {
    AccSubId?: true;
    AccSubAccountId?: true;
    AccSubPlanId?: true;
  };

  export type AccountSubscriptionSumAggregateInputType = {
    AccSubId?: true;
    AccSubAccountId?: true;
    AccSubPlanId?: true;
  };

  export type AccountSubscriptionMinAggregateInputType = {
    AccSubId?: true;
    AccSubAccountId?: true;
    AccSubPlanId?: true;
    AccSubStartDate?: true;
    AccSubEndDate?: true;
    AccSubIsActive?: true;
  };

  export type AccountSubscriptionMaxAggregateInputType = {
    AccSubId?: true;
    AccSubAccountId?: true;
    AccSubPlanId?: true;
    AccSubStartDate?: true;
    AccSubEndDate?: true;
    AccSubIsActive?: true;
  };

  export type AccountSubscriptionCountAggregateInputType = {
    AccSubId?: true;
    AccSubAccountId?: true;
    AccSubPlanId?: true;
    AccSubStartDate?: true;
    AccSubEndDate?: true;
    AccSubIsActive?: true;
    _all?: true;
  };

  export type AccountSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountSubscription to aggregate.
     */
    where?: AccountSubscriptionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountSubscriptions to fetch.
     */
    orderBy?: AccountSubscriptionOrderByWithRelationInput | AccountSubscriptionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountSubscriptionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountSubscriptions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountSubscriptions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AccountSubscriptions
     **/
    _count?: true | AccountSubscriptionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AccountSubscriptionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AccountSubscriptionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AccountSubscriptionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AccountSubscriptionMaxAggregateInputType;
  };

  export type GetAccountSubscriptionAggregateType<T extends AccountSubscriptionAggregateArgs> = {
    [P in keyof T & keyof AggregateAccountSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountSubscription[P]>
      : GetScalarType<T[P], AggregateAccountSubscription[P]>;
  };

  export type AccountSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountSubscriptionWhereInput;
    orderBy?: AccountSubscriptionOrderByWithAggregationInput | AccountSubscriptionOrderByWithAggregationInput[];
    by: AccountSubscriptionScalarFieldEnum[] | AccountSubscriptionScalarFieldEnum;
    having?: AccountSubscriptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountSubscriptionCountAggregateInputType | true;
    _avg?: AccountSubscriptionAvgAggregateInputType;
    _sum?: AccountSubscriptionSumAggregateInputType;
    _min?: AccountSubscriptionMinAggregateInputType;
    _max?: AccountSubscriptionMaxAggregateInputType;
  };

  export type AccountSubscriptionGroupByOutputType = {
    AccSubId: number;
    AccSubAccountId: number;
    AccSubPlanId: number;
    AccSubStartDate: Date;
    AccSubEndDate: Date | null;
    AccSubIsActive: boolean | null;
    _count: AccountSubscriptionCountAggregateOutputType | null;
    _avg: AccountSubscriptionAvgAggregateOutputType | null;
    _sum: AccountSubscriptionSumAggregateOutputType | null;
    _min: AccountSubscriptionMinAggregateOutputType | null;
    _max: AccountSubscriptionMaxAggregateOutputType | null;
  };

  type GetAccountSubscriptionGroupByPayload<T extends AccountSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountSubscriptionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AccountSubscriptionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AccountSubscriptionGroupByOutputType[P]>
          : GetScalarType<T[P], AccountSubscriptionGroupByOutputType[P]>;
      }
    >
  >;

  export type AccountSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        AccSubId?: boolean;
        AccSubAccountId?: boolean;
        AccSubPlanId?: boolean;
        AccSubStartDate?: boolean;
        AccSubEndDate?: boolean;
        AccSubIsActive?: boolean;
        Account?: boolean | AccountDefaultArgs<ExtArgs>;
        SubscriptionPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['accountSubscription']
    >;

  export type AccountSubscriptionSelectScalar = {
    AccSubId?: boolean;
    AccSubAccountId?: boolean;
    AccSubPlanId?: boolean;
    AccSubStartDate?: boolean;
    AccSubEndDate?: boolean;
    AccSubIsActive?: boolean;
  };

  export type AccountSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | AccountDefaultArgs<ExtArgs>;
    SubscriptionPlan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>;
  };

  export type $AccountSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'AccountSubscription';
    objects: {
      Account: Prisma.$AccountPayload<ExtArgs>;
      SubscriptionPlan: Prisma.$SubscriptionPlanPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        AccSubId: number;
        AccSubAccountId: number;
        AccSubPlanId: number;
        AccSubStartDate: Date;
        AccSubEndDate: Date | null;
        AccSubIsActive: boolean | null;
      },
      ExtArgs['result']['accountSubscription']
    >;
    composites: {};
  };

  type AccountSubscriptionGetPayload<S extends boolean | null | undefined | AccountSubscriptionDefaultArgs> =
    $Result.GetResult<Prisma.$AccountSubscriptionPayload, S>;

  type AccountSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AccountSubscriptionFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: AccountSubscriptionCountAggregateInputType | true;
  };

  export interface AccountSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AccountSubscription'];
      meta: { name: 'AccountSubscription' };
    };
    /**
     * Find zero or one AccountSubscription that matches the filter.
     * @param {AccountSubscriptionFindUniqueArgs} args - Arguments to find a AccountSubscription
     * @example
     * // Get one AccountSubscription
     * const accountSubscription = await prisma.accountSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends AccountSubscriptionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AccountSubscriptionFindUniqueArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one AccountSubscription that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {AccountSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a AccountSubscription
     * @example
     * // Get one AccountSubscription
     * const accountSubscription = await prisma.accountSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends AccountSubscriptionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountSubscriptionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first AccountSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountSubscriptionFindFirstArgs} args - Arguments to find a AccountSubscription
     * @example
     * // Get one AccountSubscription
     * const accountSubscription = await prisma.accountSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends AccountSubscriptionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountSubscriptionFindFirstArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first AccountSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountSubscriptionFindFirstOrThrowArgs} args - Arguments to find a AccountSubscription
     * @example
     * // Get one AccountSubscription
     * const accountSubscription = await prisma.accountSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends AccountSubscriptionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountSubscriptionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more AccountSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountSubscriptionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountSubscriptions
     * const accountSubscriptions = await prisma.accountSubscription.findMany()
     *
     * // Get first 10 AccountSubscriptions
     * const accountSubscriptions = await prisma.accountSubscription.findMany({ take: 10 })
     *
     * // Only select the `AccSubId`
     * const accountSubscriptionWithAccSubIdOnly = await prisma.accountSubscription.findMany({ select: { AccSubId: true } })
     *
     **/
    findMany<T extends AccountSubscriptionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountSubscriptionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a AccountSubscription.
     * @param {AccountSubscriptionCreateArgs} args - Arguments to create a AccountSubscription.
     * @example
     * // Create one AccountSubscription
     * const AccountSubscription = await prisma.accountSubscription.create({
     *   data: {
     *     // ... data to create a AccountSubscription
     *   }
     * })
     *
     **/
    create<T extends AccountSubscriptionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountSubscriptionCreateArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many AccountSubscriptions.
     *     @param {AccountSubscriptionCreateManyArgs} args - Arguments to create many AccountSubscriptions.
     *     @example
     *     // Create many AccountSubscriptions
     *     const accountSubscription = await prisma.accountSubscription.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends AccountSubscriptionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountSubscriptionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a AccountSubscription.
     * @param {AccountSubscriptionDeleteArgs} args - Arguments to delete one AccountSubscription.
     * @example
     * // Delete one AccountSubscription
     * const AccountSubscription = await prisma.accountSubscription.delete({
     *   where: {
     *     // ... filter to delete one AccountSubscription
     *   }
     * })
     *
     **/
    delete<T extends AccountSubscriptionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AccountSubscriptionDeleteArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one AccountSubscription.
     * @param {AccountSubscriptionUpdateArgs} args - Arguments to update one AccountSubscription.
     * @example
     * // Update one AccountSubscription
     * const accountSubscription = await prisma.accountSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends AccountSubscriptionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountSubscriptionUpdateArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more AccountSubscriptions.
     * @param {AccountSubscriptionDeleteManyArgs} args - Arguments to filter AccountSubscriptions to delete.
     * @example
     * // Delete a few AccountSubscriptions
     * const { count } = await prisma.accountSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends AccountSubscriptionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountSubscriptionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AccountSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountSubscriptions
     * const accountSubscription = await prisma.accountSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends AccountSubscriptionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AccountSubscriptionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AccountSubscription.
     * @param {AccountSubscriptionUpsertArgs} args - Arguments to update or create a AccountSubscription.
     * @example
     * // Update or create a AccountSubscription
     * const accountSubscription = await prisma.accountSubscription.upsert({
     *   create: {
     *     // ... data to create a AccountSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountSubscription we want to update
     *   }
     * })
     **/
    upsert<T extends AccountSubscriptionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AccountSubscriptionUpsertArgs<ExtArgs>>,
    ): Prisma__AccountSubscriptionClient<
      $Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of AccountSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountSubscriptionCountArgs} args - Arguments to filter AccountSubscriptions to count.
     * @example
     * // Count the number of AccountSubscriptions
     * const count = await prisma.accountSubscription.count({
     *   where: {
     *     // ... the filter for the AccountSubscriptions we want to count
     *   }
     * })
     **/
    count<T extends AccountSubscriptionCountArgs>(
      args?: Subset<T, AccountSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountSubscriptionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AccountSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AccountSubscriptionAggregateArgs>(
      args: Subset<T, AccountSubscriptionAggregateArgs>,
    ): Prisma.PrismaPromise<GetAccountSubscriptionAggregateType<T>>;

    /**
     * Group by AccountSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AccountSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: AccountSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountSubscriptionGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAccountSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AccountSubscription model
     */
    readonly fields: AccountSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountSubscriptionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    Account<T extends AccountDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AccountDefaultArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    SubscriptionPlan<T extends SubscriptionPlanDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, SubscriptionPlanDefaultArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AccountSubscription model
   */
  interface AccountSubscriptionFieldRefs {
    readonly AccSubId: FieldRef<'AccountSubscription', 'Int'>;
    readonly AccSubAccountId: FieldRef<'AccountSubscription', 'Int'>;
    readonly AccSubPlanId: FieldRef<'AccountSubscription', 'Int'>;
    readonly AccSubStartDate: FieldRef<'AccountSubscription', 'DateTime'>;
    readonly AccSubEndDate: FieldRef<'AccountSubscription', 'DateTime'>;
    readonly AccSubIsActive: FieldRef<'AccountSubscription', 'Boolean'>;
  }

  // Custom InputTypes
  /**
   * AccountSubscription findUnique
   */
  export type AccountSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountSubscription to fetch.
     */
    where: AccountSubscriptionWhereUniqueInput;
  };

  /**
   * AccountSubscription findUniqueOrThrow
   */
  export type AccountSubscriptionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountSubscription to fetch.
     */
    where: AccountSubscriptionWhereUniqueInput;
  };

  /**
   * AccountSubscription findFirst
   */
  export type AccountSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountSubscription to fetch.
     */
    where?: AccountSubscriptionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountSubscriptions to fetch.
     */
    orderBy?: AccountSubscriptionOrderByWithRelationInput | AccountSubscriptionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountSubscriptions.
     */
    cursor?: AccountSubscriptionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountSubscriptions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountSubscriptions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountSubscriptions.
     */
    distinct?: AccountSubscriptionScalarFieldEnum | AccountSubscriptionScalarFieldEnum[];
  };

  /**
   * AccountSubscription findFirstOrThrow
   */
  export type AccountSubscriptionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountSubscription to fetch.
     */
    where?: AccountSubscriptionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountSubscriptions to fetch.
     */
    orderBy?: AccountSubscriptionOrderByWithRelationInput | AccountSubscriptionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountSubscriptions.
     */
    cursor?: AccountSubscriptionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountSubscriptions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountSubscriptions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountSubscriptions.
     */
    distinct?: AccountSubscriptionScalarFieldEnum | AccountSubscriptionScalarFieldEnum[];
  };

  /**
   * AccountSubscription findMany
   */
  export type AccountSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountSubscriptions to fetch.
     */
    where?: AccountSubscriptionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountSubscriptions to fetch.
     */
    orderBy?: AccountSubscriptionOrderByWithRelationInput | AccountSubscriptionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AccountSubscriptions.
     */
    cursor?: AccountSubscriptionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountSubscriptions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountSubscriptions.
     */
    skip?: number;
    distinct?: AccountSubscriptionScalarFieldEnum | AccountSubscriptionScalarFieldEnum[];
  };

  /**
   * AccountSubscription create
   */
  export type AccountSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * The data needed to create a AccountSubscription.
     */
    data: XOR<AccountSubscriptionCreateInput, AccountSubscriptionUncheckedCreateInput>;
  };

  /**
   * AccountSubscription createMany
   */
  export type AccountSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccountSubscriptions.
     */
    data: AccountSubscriptionCreateManyInput | AccountSubscriptionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AccountSubscription update
   */
  export type AccountSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * The data needed to update a AccountSubscription.
     */
    data: XOR<AccountSubscriptionUpdateInput, AccountSubscriptionUncheckedUpdateInput>;
    /**
     * Choose, which AccountSubscription to update.
     */
    where: AccountSubscriptionWhereUniqueInput;
  };

  /**
   * AccountSubscription updateMany
   */
  export type AccountSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccountSubscriptions.
     */
    data: XOR<AccountSubscriptionUpdateManyMutationInput, AccountSubscriptionUncheckedUpdateManyInput>;
    /**
     * Filter which AccountSubscriptions to update
     */
    where?: AccountSubscriptionWhereInput;
  };

  /**
   * AccountSubscription upsert
   */
  export type AccountSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * The filter to search for the AccountSubscription to update in case it exists.
     */
    where: AccountSubscriptionWhereUniqueInput;
    /**
     * In case the AccountSubscription found by the `where` argument doesn't exist, create a new AccountSubscription with this data.
     */
    create: XOR<AccountSubscriptionCreateInput, AccountSubscriptionUncheckedCreateInput>;
    /**
     * In case the AccountSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountSubscriptionUpdateInput, AccountSubscriptionUncheckedUpdateInput>;
  };

  /**
   * AccountSubscription delete
   */
  export type AccountSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    /**
     * Filter which AccountSubscription to delete.
     */
    where: AccountSubscriptionWhereUniqueInput;
  };

  /**
   * AccountSubscription deleteMany
   */
  export type AccountSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountSubscriptions to delete
     */
    where?: AccountSubscriptionWhereInput;
  };

  /**
   * AccountSubscription without action
   */
  export type AccountSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
  };

  /**
   * Model AccountUser
   */

  export type AggregateAccountUser = {
    _count: AccountUserCountAggregateOutputType | null;
    _avg: AccountUserAvgAggregateOutputType | null;
    _sum: AccountUserSumAggregateOutputType | null;
    _min: AccountUserMinAggregateOutputType | null;
    _max: AccountUserMaxAggregateOutputType | null;
  };

  export type AccountUserAvgAggregateOutputType = {
    AccUserId: number | null;
    AccUserUserId: number | null;
    AccUserAccountId: number | null;
  };

  export type AccountUserSumAggregateOutputType = {
    AccUserId: number | null;
    AccUserUserId: number | null;
    AccUserAccountId: number | null;
  };

  export type AccountUserMinAggregateOutputType = {
    AccUserId: number | null;
    AccUserUserId: number | null;
    AccUserAccountId: number | null;
    AccUserIsAdmin: boolean | null;
    AccUserPIN: string | null;
  };

  export type AccountUserMaxAggregateOutputType = {
    AccUserId: number | null;
    AccUserUserId: number | null;
    AccUserAccountId: number | null;
    AccUserIsAdmin: boolean | null;
    AccUserPIN: string | null;
  };

  export type AccountUserCountAggregateOutputType = {
    AccUserId: number;
    AccUserUserId: number;
    AccUserAccountId: number;
    AccUserIsAdmin: number;
    AccUserPIN: number;
    _all: number;
  };

  export type AccountUserAvgAggregateInputType = {
    AccUserId?: true;
    AccUserUserId?: true;
    AccUserAccountId?: true;
  };

  export type AccountUserSumAggregateInputType = {
    AccUserId?: true;
    AccUserUserId?: true;
    AccUserAccountId?: true;
  };

  export type AccountUserMinAggregateInputType = {
    AccUserId?: true;
    AccUserUserId?: true;
    AccUserAccountId?: true;
    AccUserIsAdmin?: true;
    AccUserPIN?: true;
  };

  export type AccountUserMaxAggregateInputType = {
    AccUserId?: true;
    AccUserUserId?: true;
    AccUserAccountId?: true;
    AccUserIsAdmin?: true;
    AccUserPIN?: true;
  };

  export type AccountUserCountAggregateInputType = {
    AccUserId?: true;
    AccUserUserId?: true;
    AccUserAccountId?: true;
    AccUserIsAdmin?: true;
    AccUserPIN?: true;
    _all?: true;
  };

  export type AccountUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountUser to aggregate.
     */
    where?: AccountUserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUsers to fetch.
     */
    orderBy?: AccountUserOrderByWithRelationInput | AccountUserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountUserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUsers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUsers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AccountUsers
     **/
    _count?: true | AccountUserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AccountUserAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AccountUserSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AccountUserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AccountUserMaxAggregateInputType;
  };

  export type GetAccountUserAggregateType<T extends AccountUserAggregateArgs> = {
    [P in keyof T & keyof AggregateAccountUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountUser[P]>
      : GetScalarType<T[P], AggregateAccountUser[P]>;
  };

  export type AccountUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountUserWhereInput;
    orderBy?: AccountUserOrderByWithAggregationInput | AccountUserOrderByWithAggregationInput[];
    by: AccountUserScalarFieldEnum[] | AccountUserScalarFieldEnum;
    having?: AccountUserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountUserCountAggregateInputType | true;
    _avg?: AccountUserAvgAggregateInputType;
    _sum?: AccountUserSumAggregateInputType;
    _min?: AccountUserMinAggregateInputType;
    _max?: AccountUserMaxAggregateInputType;
  };

  export type AccountUserGroupByOutputType = {
    AccUserId: number;
    AccUserUserId: number;
    AccUserAccountId: number;
    AccUserIsAdmin: boolean;
    AccUserPIN: string | null;
    _count: AccountUserCountAggregateOutputType | null;
    _avg: AccountUserAvgAggregateOutputType | null;
    _sum: AccountUserSumAggregateOutputType | null;
    _min: AccountUserMinAggregateOutputType | null;
    _max: AccountUserMaxAggregateOutputType | null;
  };

  type GetAccountUserGroupByPayload<T extends AccountUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountUserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AccountUserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AccountUserGroupByOutputType[P]>
          : GetScalarType<T[P], AccountUserGroupByOutputType[P]>;
      }
    >
  >;

  export type AccountUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        AccUserId?: boolean;
        AccUserUserId?: boolean;
        AccUserAccountId?: boolean;
        AccUserIsAdmin?: boolean;
        AccUserPIN?: boolean;
        Account?: boolean | AccountDefaultArgs<ExtArgs>;
        User?: boolean | UserDefaultArgs<ExtArgs>;
        AccountUserPermission?: boolean | AccountUser$AccountUserPermissionArgs<ExtArgs>;
        _count?: boolean | AccountUserCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['accountUser']
    >;

  export type AccountUserSelectScalar = {
    AccUserId?: boolean;
    AccUserUserId?: boolean;
    AccUserAccountId?: boolean;
    AccUserIsAdmin?: boolean;
    AccUserPIN?: boolean;
  };

  export type AccountUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | AccountDefaultArgs<ExtArgs>;
    User?: boolean | UserDefaultArgs<ExtArgs>;
    AccountUserPermission?: boolean | AccountUser$AccountUserPermissionArgs<ExtArgs>;
    _count?: boolean | AccountUserCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $AccountUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'AccountUser';
    objects: {
      Account: Prisma.$AccountPayload<ExtArgs>;
      User: Prisma.$UserPayload<ExtArgs>;
      AccountUserPermission: Prisma.$AccountUserPermissionPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        AccUserId: number;
        AccUserUserId: number;
        AccUserAccountId: number;
        AccUserIsAdmin: boolean;
        AccUserPIN: string | null;
      },
      ExtArgs['result']['accountUser']
    >;
    composites: {};
  };

  type AccountUserGetPayload<S extends boolean | null | undefined | AccountUserDefaultArgs> = $Result.GetResult<
    Prisma.$AccountUserPayload,
    S
  >;

  type AccountUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AccountUserFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: AccountUserCountAggregateInputType | true;
  };

  export interface AccountUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccountUser']; meta: { name: 'AccountUser' } };
    /**
     * Find zero or one AccountUser that matches the filter.
     * @param {AccountUserFindUniqueArgs} args - Arguments to find a AccountUser
     * @example
     * // Get one AccountUser
     * const accountUser = await prisma.accountUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends AccountUserFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserFindUniqueArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<
      $Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one AccountUser that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {AccountUserFindUniqueOrThrowArgs} args - Arguments to find a AccountUser
     * @example
     * // Get one AccountUser
     * const accountUser = await prisma.accountUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends AccountUserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<
      $Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first AccountUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserFindFirstArgs} args - Arguments to find a AccountUser
     * @example
     * // Get one AccountUser
     * const accountUser = await prisma.accountUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends AccountUserFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserFindFirstArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<
      $Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first AccountUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserFindFirstOrThrowArgs} args - Arguments to find a AccountUser
     * @example
     * // Get one AccountUser
     * const accountUser = await prisma.accountUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends AccountUserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<
      $Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more AccountUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountUsers
     * const accountUsers = await prisma.accountUser.findMany()
     *
     * // Get first 10 AccountUsers
     * const accountUsers = await prisma.accountUser.findMany({ take: 10 })
     *
     * // Only select the `AccUserId`
     * const accountUserWithAccUserIdOnly = await prisma.accountUser.findMany({ select: { AccUserId: true } })
     *
     **/
    findMany<T extends AccountUserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a AccountUser.
     * @param {AccountUserCreateArgs} args - Arguments to create a AccountUser.
     * @example
     * // Create one AccountUser
     * const AccountUser = await prisma.accountUser.create({
     *   data: {
     *     // ... data to create a AccountUser
     *   }
     * })
     *
     **/
    create<T extends AccountUserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserCreateArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<$Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'create'>, never, ExtArgs>;

    /**
     * Create many AccountUsers.
     *     @param {AccountUserCreateManyArgs} args - Arguments to create many AccountUsers.
     *     @example
     *     // Create many AccountUsers
     *     const accountUser = await prisma.accountUser.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends AccountUserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a AccountUser.
     * @param {AccountUserDeleteArgs} args - Arguments to delete one AccountUser.
     * @example
     * // Delete one AccountUser
     * const AccountUser = await prisma.accountUser.delete({
     *   where: {
     *     // ... filter to delete one AccountUser
     *   }
     * })
     *
     **/
    delete<T extends AccountUserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserDeleteArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<$Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>;

    /**
     * Update one AccountUser.
     * @param {AccountUserUpdateArgs} args - Arguments to update one AccountUser.
     * @example
     * // Update one AccountUser
     * const accountUser = await prisma.accountUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends AccountUserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserUpdateArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<$Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'update'>, never, ExtArgs>;

    /**
     * Delete zero or more AccountUsers.
     * @param {AccountUserDeleteManyArgs} args - Arguments to filter AccountUsers to delete.
     * @example
     * // Delete a few AccountUsers
     * const { count } = await prisma.accountUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends AccountUserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AccountUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountUsers
     * const accountUser = await prisma.accountUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends AccountUserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AccountUser.
     * @param {AccountUserUpsertArgs} args - Arguments to update or create a AccountUser.
     * @example
     * // Update or create a AccountUser
     * const accountUser = await prisma.accountUser.upsert({
     *   create: {
     *     // ... data to create a AccountUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountUser we want to update
     *   }
     * })
     **/
    upsert<T extends AccountUserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserUpsertArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<$Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>;

    /**
     * Count the number of AccountUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserCountArgs} args - Arguments to filter AccountUsers to count.
     * @example
     * // Count the number of AccountUsers
     * const count = await prisma.accountUser.count({
     *   where: {
     *     // ... the filter for the AccountUsers we want to count
     *   }
     * })
     **/
    count<T extends AccountUserCountArgs>(
      args?: Subset<T, AccountUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountUserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AccountUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AccountUserAggregateArgs>(
      args: Subset<T, AccountUserAggregateArgs>,
    ): Prisma.PrismaPromise<GetAccountUserAggregateType<T>>;

    /**
     * Group by AccountUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AccountUserGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountUserGroupByArgs['orderBy'] }
        : { orderBy?: AccountUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountUserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAccountUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AccountUser model
     */
    readonly fields: AccountUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountUserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    Account<T extends AccountDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AccountDefaultArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    User<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    AccountUserPermission<T extends AccountUser$AccountUserPermissionArgs<ExtArgs> = {}>(
      args?: Subset<T, AccountUser$AccountUserPermissionArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AccountUser model
   */
  interface AccountUserFieldRefs {
    readonly AccUserId: FieldRef<'AccountUser', 'Int'>;
    readonly AccUserUserId: FieldRef<'AccountUser', 'Int'>;
    readonly AccUserAccountId: FieldRef<'AccountUser', 'Int'>;
    readonly AccUserIsAdmin: FieldRef<'AccountUser', 'Boolean'>;
    readonly AccUserPIN: FieldRef<'AccountUser', 'String'>;
  }

  // Custom InputTypes
  /**
   * AccountUser findUnique
   */
  export type AccountUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUser to fetch.
     */
    where: AccountUserWhereUniqueInput;
  };

  /**
   * AccountUser findUniqueOrThrow
   */
  export type AccountUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUser to fetch.
     */
    where: AccountUserWhereUniqueInput;
  };

  /**
   * AccountUser findFirst
   */
  export type AccountUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUser to fetch.
     */
    where?: AccountUserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUsers to fetch.
     */
    orderBy?: AccountUserOrderByWithRelationInput | AccountUserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountUsers.
     */
    cursor?: AccountUserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUsers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUsers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountUsers.
     */
    distinct?: AccountUserScalarFieldEnum | AccountUserScalarFieldEnum[];
  };

  /**
   * AccountUser findFirstOrThrow
   */
  export type AccountUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUser to fetch.
     */
    where?: AccountUserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUsers to fetch.
     */
    orderBy?: AccountUserOrderByWithRelationInput | AccountUserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountUsers.
     */
    cursor?: AccountUserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUsers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUsers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountUsers.
     */
    distinct?: AccountUserScalarFieldEnum | AccountUserScalarFieldEnum[];
  };

  /**
   * AccountUser findMany
   */
  export type AccountUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUsers to fetch.
     */
    where?: AccountUserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUsers to fetch.
     */
    orderBy?: AccountUserOrderByWithRelationInput | AccountUserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AccountUsers.
     */
    cursor?: AccountUserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUsers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUsers.
     */
    skip?: number;
    distinct?: AccountUserScalarFieldEnum | AccountUserScalarFieldEnum[];
  };

  /**
   * AccountUser create
   */
  export type AccountUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * The data needed to create a AccountUser.
     */
    data: XOR<AccountUserCreateInput, AccountUserUncheckedCreateInput>;
  };

  /**
   * AccountUser createMany
   */
  export type AccountUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccountUsers.
     */
    data: AccountUserCreateManyInput | AccountUserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AccountUser update
   */
  export type AccountUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * The data needed to update a AccountUser.
     */
    data: XOR<AccountUserUpdateInput, AccountUserUncheckedUpdateInput>;
    /**
     * Choose, which AccountUser to update.
     */
    where: AccountUserWhereUniqueInput;
  };

  /**
   * AccountUser updateMany
   */
  export type AccountUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccountUsers.
     */
    data: XOR<AccountUserUpdateManyMutationInput, AccountUserUncheckedUpdateManyInput>;
    /**
     * Filter which AccountUsers to update
     */
    where?: AccountUserWhereInput;
  };

  /**
   * AccountUser upsert
   */
  export type AccountUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * The filter to search for the AccountUser to update in case it exists.
     */
    where: AccountUserWhereUniqueInput;
    /**
     * In case the AccountUser found by the `where` argument doesn't exist, create a new AccountUser with this data.
     */
    create: XOR<AccountUserCreateInput, AccountUserUncheckedCreateInput>;
    /**
     * In case the AccountUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUserUpdateInput, AccountUserUncheckedUpdateInput>;
  };

  /**
   * AccountUser delete
   */
  export type AccountUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    /**
     * Filter which AccountUser to delete.
     */
    where: AccountUserWhereUniqueInput;
  };

  /**
   * AccountUser deleteMany
   */
  export type AccountUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountUsers to delete
     */
    where?: AccountUserWhereInput;
  };

  /**
   * AccountUser.AccountUserPermission
   */
  export type AccountUser$AccountUserPermissionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    where?: AccountUserPermissionWhereInput;
    orderBy?: AccountUserPermissionOrderByWithRelationInput | AccountUserPermissionOrderByWithRelationInput[];
    cursor?: AccountUserPermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountUserPermissionScalarFieldEnum | AccountUserPermissionScalarFieldEnum[];
  };

  /**
   * AccountUser without action
   */
  export type AccountUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
  };

  /**
   * Model AccountUserPermission
   */

  export type AggregateAccountUserPermission = {
    _count: AccountUserPermissionCountAggregateOutputType | null;
    _avg: AccountUserPermissionAvgAggregateOutputType | null;
    _sum: AccountUserPermissionSumAggregateOutputType | null;
    _min: AccountUserPermissionMinAggregateOutputType | null;
    _max: AccountUserPermissionMaxAggregateOutputType | null;
  };

  export type AccountUserPermissionAvgAggregateOutputType = {
    UserAuthId: number | null;
    UserAuthAccUserId: number | null;
    UserAuthPermissionId: number | null;
  };

  export type AccountUserPermissionSumAggregateOutputType = {
    UserAuthId: number | null;
    UserAuthAccUserId: number | null;
    UserAuthPermissionId: number | null;
  };

  export type AccountUserPermissionMinAggregateOutputType = {
    UserAuthId: number | null;
    UserAuthAccUserId: number | null;
    UserAuthPermissionId: number | null;
  };

  export type AccountUserPermissionMaxAggregateOutputType = {
    UserAuthId: number | null;
    UserAuthAccUserId: number | null;
    UserAuthPermissionId: number | null;
  };

  export type AccountUserPermissionCountAggregateOutputType = {
    UserAuthId: number;
    UserAuthAccUserId: number;
    UserAuthPermissionId: number;
    _all: number;
  };

  export type AccountUserPermissionAvgAggregateInputType = {
    UserAuthId?: true;
    UserAuthAccUserId?: true;
    UserAuthPermissionId?: true;
  };

  export type AccountUserPermissionSumAggregateInputType = {
    UserAuthId?: true;
    UserAuthAccUserId?: true;
    UserAuthPermissionId?: true;
  };

  export type AccountUserPermissionMinAggregateInputType = {
    UserAuthId?: true;
    UserAuthAccUserId?: true;
    UserAuthPermissionId?: true;
  };

  export type AccountUserPermissionMaxAggregateInputType = {
    UserAuthId?: true;
    UserAuthAccUserId?: true;
    UserAuthPermissionId?: true;
  };

  export type AccountUserPermissionCountAggregateInputType = {
    UserAuthId?: true;
    UserAuthAccUserId?: true;
    UserAuthPermissionId?: true;
    _all?: true;
  };

  export type AccountUserPermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccountUserPermission to aggregate.
     */
    where?: AccountUserPermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUserPermissions to fetch.
     */
    orderBy?: AccountUserPermissionOrderByWithRelationInput | AccountUserPermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountUserPermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUserPermissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUserPermissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AccountUserPermissions
     **/
    _count?: true | AccountUserPermissionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AccountUserPermissionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AccountUserPermissionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AccountUserPermissionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AccountUserPermissionMaxAggregateInputType;
  };

  export type GetAccountUserPermissionAggregateType<T extends AccountUserPermissionAggregateArgs> = {
    [P in keyof T & keyof AggregateAccountUserPermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccountUserPermission[P]>
      : GetScalarType<T[P], AggregateAccountUserPermission[P]>;
  };

  export type AccountUserPermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountUserPermissionWhereInput;
    orderBy?: AccountUserPermissionOrderByWithAggregationInput | AccountUserPermissionOrderByWithAggregationInput[];
    by: AccountUserPermissionScalarFieldEnum[] | AccountUserPermissionScalarFieldEnum;
    having?: AccountUserPermissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountUserPermissionCountAggregateInputType | true;
    _avg?: AccountUserPermissionAvgAggregateInputType;
    _sum?: AccountUserPermissionSumAggregateInputType;
    _min?: AccountUserPermissionMinAggregateInputType;
    _max?: AccountUserPermissionMaxAggregateInputType;
  };

  export type AccountUserPermissionGroupByOutputType = {
    UserAuthId: number;
    UserAuthAccUserId: number;
    UserAuthPermissionId: number;
    _count: AccountUserPermissionCountAggregateOutputType | null;
    _avg: AccountUserPermissionAvgAggregateOutputType | null;
    _sum: AccountUserPermissionSumAggregateOutputType | null;
    _min: AccountUserPermissionMinAggregateOutputType | null;
    _max: AccountUserPermissionMaxAggregateOutputType | null;
  };

  type GetAccountUserPermissionGroupByPayload<T extends AccountUserPermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountUserPermissionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AccountUserPermissionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AccountUserPermissionGroupByOutputType[P]>
          : GetScalarType<T[P], AccountUserPermissionGroupByOutputType[P]>;
      }
    >
  >;

  export type AccountUserPermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        UserAuthId?: boolean;
        UserAuthAccUserId?: boolean;
        UserAuthPermissionId?: boolean;
        AccountUser?: boolean | AccountUserDefaultArgs<ExtArgs>;
        Permission?: boolean | PermissionDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['accountUserPermission']
    >;

  export type AccountUserPermissionSelectScalar = {
    UserAuthId?: boolean;
    UserAuthAccUserId?: boolean;
    UserAuthPermissionId?: boolean;
  };

  export type AccountUserPermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AccountUser?: boolean | AccountUserDefaultArgs<ExtArgs>;
    Permission?: boolean | PermissionDefaultArgs<ExtArgs>;
  };

  export type $AccountUserPermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'AccountUserPermission';
    objects: {
      AccountUser: Prisma.$AccountUserPayload<ExtArgs>;
      Permission: Prisma.$PermissionPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        UserAuthId: number;
        UserAuthAccUserId: number;
        UserAuthPermissionId: number;
      },
      ExtArgs['result']['accountUserPermission']
    >;
    composites: {};
  };

  type AccountUserPermissionGetPayload<S extends boolean | null | undefined | AccountUserPermissionDefaultArgs> =
    $Result.GetResult<Prisma.$AccountUserPermissionPayload, S>;

  type AccountUserPermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AccountUserPermissionFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: AccountUserPermissionCountAggregateInputType | true;
  };

  export interface AccountUserPermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AccountUserPermission'];
      meta: { name: 'AccountUserPermission' };
    };
    /**
     * Find zero or one AccountUserPermission that matches the filter.
     * @param {AccountUserPermissionFindUniqueArgs} args - Arguments to find a AccountUserPermission
     * @example
     * // Get one AccountUserPermission
     * const accountUserPermission = await prisma.accountUserPermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends AccountUserPermissionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserPermissionFindUniqueArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one AccountUserPermission that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {AccountUserPermissionFindUniqueOrThrowArgs} args - Arguments to find a AccountUserPermission
     * @example
     * // Get one AccountUserPermission
     * const accountUserPermission = await prisma.accountUserPermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends AccountUserPermissionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserPermissionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first AccountUserPermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserPermissionFindFirstArgs} args - Arguments to find a AccountUserPermission
     * @example
     * // Get one AccountUserPermission
     * const accountUserPermission = await prisma.accountUserPermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends AccountUserPermissionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserPermissionFindFirstArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first AccountUserPermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserPermissionFindFirstOrThrowArgs} args - Arguments to find a AccountUserPermission
     * @example
     * // Get one AccountUserPermission
     * const accountUserPermission = await prisma.accountUserPermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends AccountUserPermissionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserPermissionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more AccountUserPermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserPermissionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccountUserPermissions
     * const accountUserPermissions = await prisma.accountUserPermission.findMany()
     *
     * // Get first 10 AccountUserPermissions
     * const accountUserPermissions = await prisma.accountUserPermission.findMany({ take: 10 })
     *
     * // Only select the `UserAuthId`
     * const accountUserPermissionWithUserAuthIdOnly = await prisma.accountUserPermission.findMany({ select: { UserAuthId: true } })
     *
     **/
    findMany<T extends AccountUserPermissionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserPermissionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a AccountUserPermission.
     * @param {AccountUserPermissionCreateArgs} args - Arguments to create a AccountUserPermission.
     * @example
     * // Create one AccountUserPermission
     * const AccountUserPermission = await prisma.accountUserPermission.create({
     *   data: {
     *     // ... data to create a AccountUserPermission
     *   }
     * })
     *
     **/
    create<T extends AccountUserPermissionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserPermissionCreateArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many AccountUserPermissions.
     *     @param {AccountUserPermissionCreateManyArgs} args - Arguments to create many AccountUserPermissions.
     *     @example
     *     // Create many AccountUserPermissions
     *     const accountUserPermission = await prisma.accountUserPermission.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends AccountUserPermissionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserPermissionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a AccountUserPermission.
     * @param {AccountUserPermissionDeleteArgs} args - Arguments to delete one AccountUserPermission.
     * @example
     * // Delete one AccountUserPermission
     * const AccountUserPermission = await prisma.accountUserPermission.delete({
     *   where: {
     *     // ... filter to delete one AccountUserPermission
     *   }
     * })
     *
     **/
    delete<T extends AccountUserPermissionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserPermissionDeleteArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one AccountUserPermission.
     * @param {AccountUserPermissionUpdateArgs} args - Arguments to update one AccountUserPermission.
     * @example
     * // Update one AccountUserPermission
     * const accountUserPermission = await prisma.accountUserPermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends AccountUserPermissionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserPermissionUpdateArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more AccountUserPermissions.
     * @param {AccountUserPermissionDeleteManyArgs} args - Arguments to filter AccountUserPermissions to delete.
     * @example
     * // Delete a few AccountUserPermissions
     * const { count } = await prisma.accountUserPermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends AccountUserPermissionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AccountUserPermissionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AccountUserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserPermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccountUserPermissions
     * const accountUserPermission = await prisma.accountUserPermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends AccountUserPermissionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserPermissionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AccountUserPermission.
     * @param {AccountUserPermissionUpsertArgs} args - Arguments to update or create a AccountUserPermission.
     * @example
     * // Update or create a AccountUserPermission
     * const accountUserPermission = await prisma.accountUserPermission.upsert({
     *   create: {
     *     // ... data to create a AccountUserPermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccountUserPermission we want to update
     *   }
     * })
     **/
    upsert<T extends AccountUserPermissionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AccountUserPermissionUpsertArgs<ExtArgs>>,
    ): Prisma__AccountUserPermissionClient<
      $Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of AccountUserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserPermissionCountArgs} args - Arguments to filter AccountUserPermissions to count.
     * @example
     * // Count the number of AccountUserPermissions
     * const count = await prisma.accountUserPermission.count({
     *   where: {
     *     // ... the filter for the AccountUserPermissions we want to count
     *   }
     * })
     **/
    count<T extends AccountUserPermissionCountArgs>(
      args?: Subset<T, AccountUserPermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountUserPermissionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AccountUserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserPermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AccountUserPermissionAggregateArgs>(
      args: Subset<T, AccountUserPermissionAggregateArgs>,
    ): Prisma.PrismaPromise<GetAccountUserPermissionAggregateType<T>>;

    /**
     * Group by AccountUserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUserPermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AccountUserPermissionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountUserPermissionGroupByArgs['orderBy'] }
        : { orderBy?: AccountUserPermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountUserPermissionGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAccountUserPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AccountUserPermission model
     */
    readonly fields: AccountUserPermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccountUserPermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountUserPermissionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    AccountUser<T extends AccountUserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AccountUserDefaultArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<
      $Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    Permission<T extends PermissionDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, PermissionDefaultArgs<ExtArgs>>,
    ): Prisma__PermissionClient<
      $Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AccountUserPermission model
   */
  interface AccountUserPermissionFieldRefs {
    readonly UserAuthId: FieldRef<'AccountUserPermission', 'Int'>;
    readonly UserAuthAccUserId: FieldRef<'AccountUserPermission', 'Int'>;
    readonly UserAuthPermissionId: FieldRef<'AccountUserPermission', 'Int'>;
  }

  // Custom InputTypes
  /**
   * AccountUserPermission findUnique
   */
  export type AccountUserPermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AccountUserPermission
       */
      select?: AccountUserPermissionSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountUserPermissionInclude<ExtArgs> | null;
      /**
       * Filter, which AccountUserPermission to fetch.
       */
      where: AccountUserPermissionWhereUniqueInput;
    };

  /**
   * AccountUserPermission findUniqueOrThrow
   */
  export type AccountUserPermissionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUserPermission to fetch.
     */
    where: AccountUserPermissionWhereUniqueInput;
  };

  /**
   * AccountUserPermission findFirst
   */
  export type AccountUserPermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUserPermission to fetch.
     */
    where?: AccountUserPermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUserPermissions to fetch.
     */
    orderBy?: AccountUserPermissionOrderByWithRelationInput | AccountUserPermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountUserPermissions.
     */
    cursor?: AccountUserPermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUserPermissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUserPermissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountUserPermissions.
     */
    distinct?: AccountUserPermissionScalarFieldEnum | AccountUserPermissionScalarFieldEnum[];
  };

  /**
   * AccountUserPermission findFirstOrThrow
   */
  export type AccountUserPermissionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUserPermission to fetch.
     */
    where?: AccountUserPermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUserPermissions to fetch.
     */
    orderBy?: AccountUserPermissionOrderByWithRelationInput | AccountUserPermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AccountUserPermissions.
     */
    cursor?: AccountUserPermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUserPermissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUserPermissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AccountUserPermissions.
     */
    distinct?: AccountUserPermissionScalarFieldEnum | AccountUserPermissionScalarFieldEnum[];
  };

  /**
   * AccountUserPermission findMany
   */
  export type AccountUserPermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * Filter, which AccountUserPermissions to fetch.
     */
    where?: AccountUserPermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AccountUserPermissions to fetch.
     */
    orderBy?: AccountUserPermissionOrderByWithRelationInput | AccountUserPermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AccountUserPermissions.
     */
    cursor?: AccountUserPermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AccountUserPermissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AccountUserPermissions.
     */
    skip?: number;
    distinct?: AccountUserPermissionScalarFieldEnum | AccountUserPermissionScalarFieldEnum[];
  };

  /**
   * AccountUserPermission create
   */
  export type AccountUserPermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * The data needed to create a AccountUserPermission.
     */
    data: XOR<AccountUserPermissionCreateInput, AccountUserPermissionUncheckedCreateInput>;
  };

  /**
   * AccountUserPermission createMany
   */
  export type AccountUserPermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * The data used to create many AccountUserPermissions.
       */
      data: AccountUserPermissionCreateManyInput | AccountUserPermissionCreateManyInput[];
      skipDuplicates?: boolean;
    };

  /**
   * AccountUserPermission update
   */
  export type AccountUserPermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * The data needed to update a AccountUserPermission.
     */
    data: XOR<AccountUserPermissionUpdateInput, AccountUserPermissionUncheckedUpdateInput>;
    /**
     * Choose, which AccountUserPermission to update.
     */
    where: AccountUserPermissionWhereUniqueInput;
  };

  /**
   * AccountUserPermission updateMany
   */
  export type AccountUserPermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * The data used to update AccountUserPermissions.
       */
      data: XOR<AccountUserPermissionUpdateManyMutationInput, AccountUserPermissionUncheckedUpdateManyInput>;
      /**
       * Filter which AccountUserPermissions to update
       */
      where?: AccountUserPermissionWhereInput;
    };

  /**
   * AccountUserPermission upsert
   */
  export type AccountUserPermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * The filter to search for the AccountUserPermission to update in case it exists.
     */
    where: AccountUserPermissionWhereUniqueInput;
    /**
     * In case the AccountUserPermission found by the `where` argument doesn't exist, create a new AccountUserPermission with this data.
     */
    create: XOR<AccountUserPermissionCreateInput, AccountUserPermissionUncheckedCreateInput>;
    /**
     * In case the AccountUserPermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUserPermissionUpdateInput, AccountUserPermissionUncheckedUpdateInput>;
  };

  /**
   * AccountUserPermission delete
   */
  export type AccountUserPermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
    /**
     * Filter which AccountUserPermission to delete.
     */
    where: AccountUserPermissionWhereUniqueInput;
  };

  /**
   * AccountUserPermission deleteMany
   */
  export type AccountUserPermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Filter which AccountUserPermissions to delete
       */
      where?: AccountUserPermissionWhereInput;
    };

  /**
   * AccountUserPermission without action
   */
  export type AccountUserPermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUserPermission
     */
    select?: AccountUserPermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserPermissionInclude<ExtArgs> | null;
  };

  /**
   * Model Currency
   */

  export type AggregateCurrency = {
    _count: CurrencyCountAggregateOutputType | null;
    _min: CurrencyMinAggregateOutputType | null;
    _max: CurrencyMaxAggregateOutputType | null;
  };

  export type CurrencyMinAggregateOutputType = {
    CurrencyCode: string | null;
    CurrencyName: string | null;
    CurrencySymbolUnicode: string | null;
  };

  export type CurrencyMaxAggregateOutputType = {
    CurrencyCode: string | null;
    CurrencyName: string | null;
    CurrencySymbolUnicode: string | null;
  };

  export type CurrencyCountAggregateOutputType = {
    CurrencyCode: number;
    CurrencyName: number;
    CurrencySymbolUnicode: number;
    _all: number;
  };

  export type CurrencyMinAggregateInputType = {
    CurrencyCode?: true;
    CurrencyName?: true;
    CurrencySymbolUnicode?: true;
  };

  export type CurrencyMaxAggregateInputType = {
    CurrencyCode?: true;
    CurrencyName?: true;
    CurrencySymbolUnicode?: true;
  };

  export type CurrencyCountAggregateInputType = {
    CurrencyCode?: true;
    CurrencyName?: true;
    CurrencySymbolUnicode?: true;
    _all?: true;
  };

  export type CurrencyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Currency to aggregate.
     */
    where?: CurrencyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CurrencyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Currencies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Currencies
     **/
    _count?: true | CurrencyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CurrencyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CurrencyMaxAggregateInputType;
  };

  export type GetCurrencyAggregateType<T extends CurrencyAggregateArgs> = {
    [P in keyof T & keyof AggregateCurrency]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCurrency[P]>
      : GetScalarType<T[P], AggregateCurrency[P]>;
  };

  export type CurrencyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CurrencyWhereInput;
    orderBy?: CurrencyOrderByWithAggregationInput | CurrencyOrderByWithAggregationInput[];
    by: CurrencyScalarFieldEnum[] | CurrencyScalarFieldEnum;
    having?: CurrencyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CurrencyCountAggregateInputType | true;
    _min?: CurrencyMinAggregateInputType;
    _max?: CurrencyMaxAggregateInputType;
  };

  export type CurrencyGroupByOutputType = {
    CurrencyCode: string;
    CurrencyName: string;
    CurrencySymbolUnicode: string | null;
    _count: CurrencyCountAggregateOutputType | null;
    _min: CurrencyMinAggregateOutputType | null;
    _max: CurrencyMaxAggregateOutputType | null;
  };

  type GetCurrencyGroupByPayload<T extends CurrencyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CurrencyGroupByOutputType, T['by']> & {
        [P in keyof T & keyof CurrencyGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], CurrencyGroupByOutputType[P]>
          : GetScalarType<T[P], CurrencyGroupByOutputType[P]>;
      }
    >
  >;

  export type CurrencySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        CurrencyCode?: boolean;
        CurrencyName?: boolean;
        CurrencySymbolUnicode?: boolean;
        Account?: boolean | Currency$AccountArgs<ExtArgs>;
        _count?: boolean | CurrencyCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['currency']
    >;

  export type CurrencySelectScalar = {
    CurrencyCode?: boolean;
    CurrencyName?: boolean;
    CurrencySymbolUnicode?: boolean;
  };

  export type CurrencyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | Currency$AccountArgs<ExtArgs>;
    _count?: boolean | CurrencyCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $CurrencyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Currency';
    objects: {
      Account: Prisma.$AccountPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        CurrencyCode: string;
        CurrencyName: string;
        CurrencySymbolUnicode: string | null;
      },
      ExtArgs['result']['currency']
    >;
    composites: {};
  };

  type CurrencyGetPayload<S extends boolean | null | undefined | CurrencyDefaultArgs> = $Result.GetResult<
    Prisma.$CurrencyPayload,
    S
  >;

  type CurrencyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    CurrencyFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: CurrencyCountAggregateInputType | true;
  };

  export interface CurrencyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Currency']; meta: { name: 'Currency' } };
    /**
     * Find zero or one Currency that matches the filter.
     * @param {CurrencyFindUniqueArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends CurrencyFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, CurrencyFindUniqueArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<
      $Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Currency that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {CurrencyFindUniqueOrThrowArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends CurrencyFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CurrencyFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<
      $Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Currency that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyFindFirstArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends CurrencyFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, CurrencyFindFirstArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<
      $Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Currency that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyFindFirstOrThrowArgs} args - Arguments to find a Currency
     * @example
     * // Get one Currency
     * const currency = await prisma.currency.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends CurrencyFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, CurrencyFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<
      $Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Currencies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Currencies
     * const currencies = await prisma.currency.findMany()
     *
     * // Get first 10 Currencies
     * const currencies = await prisma.currency.findMany({ take: 10 })
     *
     * // Only select the `CurrencyCode`
     * const currencyWithCurrencyCodeOnly = await prisma.currency.findMany({ select: { CurrencyCode: true } })
     *
     **/
    findMany<T extends CurrencyFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CurrencyFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a Currency.
     * @param {CurrencyCreateArgs} args - Arguments to create a Currency.
     * @example
     * // Create one Currency
     * const Currency = await prisma.currency.create({
     *   data: {
     *     // ... data to create a Currency
     *   }
     * })
     *
     **/
    create<T extends CurrencyCreateArgs<ExtArgs>>(
      args: SelectSubset<T, CurrencyCreateArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'create'>, never, ExtArgs>;

    /**
     * Create many Currencies.
     *     @param {CurrencyCreateManyArgs} args - Arguments to create many Currencies.
     *     @example
     *     // Create many Currencies
     *     const currency = await prisma.currency.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends CurrencyCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CurrencyCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a Currency.
     * @param {CurrencyDeleteArgs} args - Arguments to delete one Currency.
     * @example
     * // Delete one Currency
     * const Currency = await prisma.currency.delete({
     *   where: {
     *     // ... filter to delete one Currency
     *   }
     * })
     *
     **/
    delete<T extends CurrencyDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, CurrencyDeleteArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>;

    /**
     * Update one Currency.
     * @param {CurrencyUpdateArgs} args - Arguments to update one Currency.
     * @example
     * // Update one Currency
     * const currency = await prisma.currency.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends CurrencyUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, CurrencyUpdateArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'update'>, never, ExtArgs>;

    /**
     * Delete zero or more Currencies.
     * @param {CurrencyDeleteManyArgs} args - Arguments to filter Currencies to delete.
     * @example
     * // Delete a few Currencies
     * const { count } = await prisma.currency.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends CurrencyDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, CurrencyDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Currencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Currencies
     * const currency = await prisma.currency.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends CurrencyUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, CurrencyUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Currency.
     * @param {CurrencyUpsertArgs} args - Arguments to update or create a Currency.
     * @example
     * // Update or create a Currency
     * const currency = await prisma.currency.upsert({
     *   create: {
     *     // ... data to create a Currency
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Currency we want to update
     *   }
     * })
     **/
    upsert<T extends CurrencyUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, CurrencyUpsertArgs<ExtArgs>>,
    ): Prisma__CurrencyClient<$Result.GetResult<Prisma.$CurrencyPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>;

    /**
     * Count the number of Currencies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyCountArgs} args - Arguments to filter Currencies to count.
     * @example
     * // Count the number of Currencies
     * const count = await prisma.currency.count({
     *   where: {
     *     // ... the filter for the Currencies we want to count
     *   }
     * })
     **/
    count<T extends CurrencyCountArgs>(
      args?: Subset<T, CurrencyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CurrencyCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Currency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CurrencyAggregateArgs>(
      args: Subset<T, CurrencyAggregateArgs>,
    ): Prisma.PrismaPromise<GetCurrencyAggregateType<T>>;

    /**
     * Group by Currency.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CurrencyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CurrencyGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CurrencyGroupByArgs['orderBy'] }
        : { orderBy?: CurrencyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, CurrencyGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetCurrencyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Currency model
     */
    readonly fields: CurrencyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Currency.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CurrencyClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    Account<T extends Currency$AccountArgs<ExtArgs> = {}>(
      args?: Subset<T, Currency$AccountArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Currency model
   */
  interface CurrencyFieldRefs {
    readonly CurrencyCode: FieldRef<'Currency', 'String'>;
    readonly CurrencyName: FieldRef<'Currency', 'String'>;
    readonly CurrencySymbolUnicode: FieldRef<'Currency', 'String'>;
  }

  // Custom InputTypes
  /**
   * Currency findUnique
   */
  export type CurrencyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * Filter, which Currency to fetch.
     */
    where: CurrencyWhereUniqueInput;
  };

  /**
   * Currency findUniqueOrThrow
   */
  export type CurrencyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * Filter, which Currency to fetch.
     */
    where: CurrencyWhereUniqueInput;
  };

  /**
   * Currency findFirst
   */
  export type CurrencyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * Filter, which Currency to fetch.
     */
    where?: CurrencyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Currencies.
     */
    cursor?: CurrencyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Currencies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Currencies.
     */
    distinct?: CurrencyScalarFieldEnum | CurrencyScalarFieldEnum[];
  };

  /**
   * Currency findFirstOrThrow
   */
  export type CurrencyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * Filter, which Currency to fetch.
     */
    where?: CurrencyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Currencies.
     */
    cursor?: CurrencyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Currencies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Currencies.
     */
    distinct?: CurrencyScalarFieldEnum | CurrencyScalarFieldEnum[];
  };

  /**
   * Currency findMany
   */
  export type CurrencyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * Filter, which Currencies to fetch.
     */
    where?: CurrencyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Currencies to fetch.
     */
    orderBy?: CurrencyOrderByWithRelationInput | CurrencyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Currencies.
     */
    cursor?: CurrencyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Currencies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Currencies.
     */
    skip?: number;
    distinct?: CurrencyScalarFieldEnum | CurrencyScalarFieldEnum[];
  };

  /**
   * Currency create
   */
  export type CurrencyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * The data needed to create a Currency.
     */
    data: XOR<CurrencyCreateInput, CurrencyUncheckedCreateInput>;
  };

  /**
   * Currency createMany
   */
  export type CurrencyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Currencies.
     */
    data: CurrencyCreateManyInput | CurrencyCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Currency update
   */
  export type CurrencyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * The data needed to update a Currency.
     */
    data: XOR<CurrencyUpdateInput, CurrencyUncheckedUpdateInput>;
    /**
     * Choose, which Currency to update.
     */
    where: CurrencyWhereUniqueInput;
  };

  /**
   * Currency updateMany
   */
  export type CurrencyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Currencies.
     */
    data: XOR<CurrencyUpdateManyMutationInput, CurrencyUncheckedUpdateManyInput>;
    /**
     * Filter which Currencies to update
     */
    where?: CurrencyWhereInput;
  };

  /**
   * Currency upsert
   */
  export type CurrencyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * The filter to search for the Currency to update in case it exists.
     */
    where: CurrencyWhereUniqueInput;
    /**
     * In case the Currency found by the `where` argument doesn't exist, create a new Currency with this data.
     */
    create: XOR<CurrencyCreateInput, CurrencyUncheckedCreateInput>;
    /**
     * In case the Currency was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CurrencyUpdateInput, CurrencyUncheckedUpdateInput>;
  };

  /**
   * Currency delete
   */
  export type CurrencyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
    /**
     * Filter which Currency to delete.
     */
    where: CurrencyWhereUniqueInput;
  };

  /**
   * Currency deleteMany
   */
  export type CurrencyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Currencies to delete
     */
    where?: CurrencyWhereInput;
  };

  /**
   * Currency.Account
   */
  export type Currency$AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Currency without action
   */
  export type CurrencyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Currency
     */
    select?: CurrencySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CurrencyInclude<ExtArgs> | null;
  };

  /**
   * Model DBSetting
   */

  export type AggregateDBSetting = {
    _count: DBSettingCountAggregateOutputType | null;
    _avg: DBSettingAvgAggregateOutputType | null;
    _sum: DBSettingSumAggregateOutputType | null;
    _min: DBSettingMinAggregateOutputType | null;
    _max: DBSettingMaxAggregateOutputType | null;
  };

  export type DBSettingAvgAggregateOutputType = {
    DBSettingId: number | null;
  };

  export type DBSettingSumAggregateOutputType = {
    DBSettingId: number | null;
  };

  export type DBSettingMinAggregateOutputType = {
    DBSettingId: number | null;
    DBSettingName: string | null;
    DBSettingValue: string | null;
  };

  export type DBSettingMaxAggregateOutputType = {
    DBSettingId: number | null;
    DBSettingName: string | null;
    DBSettingValue: string | null;
  };

  export type DBSettingCountAggregateOutputType = {
    DBSettingId: number;
    DBSettingName: number;
    DBSettingValue: number;
    _all: number;
  };

  export type DBSettingAvgAggregateInputType = {
    DBSettingId?: true;
  };

  export type DBSettingSumAggregateInputType = {
    DBSettingId?: true;
  };

  export type DBSettingMinAggregateInputType = {
    DBSettingId?: true;
    DBSettingName?: true;
    DBSettingValue?: true;
  };

  export type DBSettingMaxAggregateInputType = {
    DBSettingId?: true;
    DBSettingName?: true;
    DBSettingValue?: true;
  };

  export type DBSettingCountAggregateInputType = {
    DBSettingId?: true;
    DBSettingName?: true;
    DBSettingValue?: true;
    _all?: true;
  };

  export type DBSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DBSetting to aggregate.
     */
    where?: DBSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DBSettings to fetch.
     */
    orderBy?: DBSettingOrderByWithRelationInput | DBSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: DBSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DBSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DBSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned DBSettings
     **/
    _count?: true | DBSettingCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: DBSettingAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: DBSettingSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: DBSettingMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: DBSettingMaxAggregateInputType;
  };

  export type GetDBSettingAggregateType<T extends DBSettingAggregateArgs> = {
    [P in keyof T & keyof AggregateDBSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDBSetting[P]>
      : GetScalarType<T[P], AggregateDBSetting[P]>;
  };

  export type DBSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DBSettingWhereInput;
    orderBy?: DBSettingOrderByWithAggregationInput | DBSettingOrderByWithAggregationInput[];
    by: DBSettingScalarFieldEnum[] | DBSettingScalarFieldEnum;
    having?: DBSettingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DBSettingCountAggregateInputType | true;
    _avg?: DBSettingAvgAggregateInputType;
    _sum?: DBSettingSumAggregateInputType;
    _min?: DBSettingMinAggregateInputType;
    _max?: DBSettingMaxAggregateInputType;
  };

  export type DBSettingGroupByOutputType = {
    DBSettingId: number;
    DBSettingName: string;
    DBSettingValue: string;
    _count: DBSettingCountAggregateOutputType | null;
    _avg: DBSettingAvgAggregateOutputType | null;
    _sum: DBSettingSumAggregateOutputType | null;
    _min: DBSettingMinAggregateOutputType | null;
    _max: DBSettingMaxAggregateOutputType | null;
  };

  type GetDBSettingGroupByPayload<T extends DBSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DBSettingGroupByOutputType, T['by']> & {
        [P in keyof T & keyof DBSettingGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], DBSettingGroupByOutputType[P]>
          : GetScalarType<T[P], DBSettingGroupByOutputType[P]>;
      }
    >
  >;

  export type DBSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        DBSettingId?: boolean;
        DBSettingName?: boolean;
        DBSettingValue?: boolean;
      },
      ExtArgs['result']['dBSetting']
    >;

  export type DBSettingSelectScalar = {
    DBSettingId?: boolean;
    DBSettingName?: boolean;
    DBSettingValue?: boolean;
  };

  export type $DBSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'DBSetting';
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        DBSettingId: number;
        DBSettingName: string;
        DBSettingValue: string;
      },
      ExtArgs['result']['dBSetting']
    >;
    composites: {};
  };

  type DBSettingGetPayload<S extends boolean | null | undefined | DBSettingDefaultArgs> = $Result.GetResult<
    Prisma.$DBSettingPayload,
    S
  >;

  type DBSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    DBSettingFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: DBSettingCountAggregateInputType | true;
  };

  export interface DBSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DBSetting']; meta: { name: 'DBSetting' } };
    /**
     * Find zero or one DBSetting that matches the filter.
     * @param {DBSettingFindUniqueArgs} args - Arguments to find a DBSetting
     * @example
     * // Get one DBSetting
     * const dBSetting = await prisma.dBSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends DBSettingFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DBSettingFindUniqueArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<
      $Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one DBSetting that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {DBSettingFindUniqueOrThrowArgs} args - Arguments to find a DBSetting
     * @example
     * // Get one DBSetting
     * const dBSetting = await prisma.dBSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends DBSettingFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DBSettingFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<
      $Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first DBSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DBSettingFindFirstArgs} args - Arguments to find a DBSetting
     * @example
     * // Get one DBSetting
     * const dBSetting = await prisma.dBSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends DBSettingFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DBSettingFindFirstArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<
      $Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first DBSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DBSettingFindFirstOrThrowArgs} args - Arguments to find a DBSetting
     * @example
     * // Get one DBSetting
     * const dBSetting = await prisma.dBSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends DBSettingFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DBSettingFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<
      $Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more DBSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DBSettingFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DBSettings
     * const dBSettings = await prisma.dBSetting.findMany()
     *
     * // Get first 10 DBSettings
     * const dBSettings = await prisma.dBSetting.findMany({ take: 10 })
     *
     * // Only select the `DBSettingId`
     * const dBSettingWithDBSettingIdOnly = await prisma.dBSetting.findMany({ select: { DBSettingId: true } })
     *
     **/
    findMany<T extends DBSettingFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DBSettingFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a DBSetting.
     * @param {DBSettingCreateArgs} args - Arguments to create a DBSetting.
     * @example
     * // Create one DBSetting
     * const DBSetting = await prisma.dBSetting.create({
     *   data: {
     *     // ... data to create a DBSetting
     *   }
     * })
     *
     **/
    create<T extends DBSettingCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DBSettingCreateArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<$Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'create'>, never, ExtArgs>;

    /**
     * Create many DBSettings.
     *     @param {DBSettingCreateManyArgs} args - Arguments to create many DBSettings.
     *     @example
     *     // Create many DBSettings
     *     const dBSetting = await prisma.dBSetting.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends DBSettingCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DBSettingCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a DBSetting.
     * @param {DBSettingDeleteArgs} args - Arguments to delete one DBSetting.
     * @example
     * // Delete one DBSetting
     * const DBSetting = await prisma.dBSetting.delete({
     *   where: {
     *     // ... filter to delete one DBSetting
     *   }
     * })
     *
     **/
    delete<T extends DBSettingDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DBSettingDeleteArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<$Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>;

    /**
     * Update one DBSetting.
     * @param {DBSettingUpdateArgs} args - Arguments to update one DBSetting.
     * @example
     * // Update one DBSetting
     * const dBSetting = await prisma.dBSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends DBSettingUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DBSettingUpdateArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<$Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'update'>, never, ExtArgs>;

    /**
     * Delete zero or more DBSettings.
     * @param {DBSettingDeleteManyArgs} args - Arguments to filter DBSettings to delete.
     * @example
     * // Delete a few DBSettings
     * const { count } = await prisma.dBSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends DBSettingDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DBSettingDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more DBSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DBSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DBSettings
     * const dBSetting = await prisma.dBSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends DBSettingUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DBSettingUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one DBSetting.
     * @param {DBSettingUpsertArgs} args - Arguments to update or create a DBSetting.
     * @example
     * // Update or create a DBSetting
     * const dBSetting = await prisma.dBSetting.upsert({
     *   create: {
     *     // ... data to create a DBSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DBSetting we want to update
     *   }
     * })
     **/
    upsert<T extends DBSettingUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DBSettingUpsertArgs<ExtArgs>>,
    ): Prisma__DBSettingClient<$Result.GetResult<Prisma.$DBSettingPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>;

    /**
     * Count the number of DBSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DBSettingCountArgs} args - Arguments to filter DBSettings to count.
     * @example
     * // Count the number of DBSettings
     * const count = await prisma.dBSetting.count({
     *   where: {
     *     // ... the filter for the DBSettings we want to count
     *   }
     * })
     **/
    count<T extends DBSettingCountArgs>(
      args?: Subset<T, DBSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DBSettingCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a DBSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DBSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends DBSettingAggregateArgs>(
      args: Subset<T, DBSettingAggregateArgs>,
    ): Prisma.PrismaPromise<GetDBSettingAggregateType<T>>;

    /**
     * Group by DBSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DBSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends DBSettingGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DBSettingGroupByArgs['orderBy'] }
        : { orderBy?: DBSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, DBSettingGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetDBSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the DBSetting model
     */
    readonly fields: DBSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DBSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DBSettingClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the DBSetting model
   */
  interface DBSettingFieldRefs {
    readonly DBSettingId: FieldRef<'DBSetting', 'Int'>;
    readonly DBSettingName: FieldRef<'DBSetting', 'String'>;
    readonly DBSettingValue: FieldRef<'DBSetting', 'String'>;
  }

  // Custom InputTypes
  /**
   * DBSetting findUnique
   */
  export type DBSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * Filter, which DBSetting to fetch.
     */
    where: DBSettingWhereUniqueInput;
  };

  /**
   * DBSetting findUniqueOrThrow
   */
  export type DBSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * Filter, which DBSetting to fetch.
     */
    where: DBSettingWhereUniqueInput;
  };

  /**
   * DBSetting findFirst
   */
  export type DBSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * Filter, which DBSetting to fetch.
     */
    where?: DBSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DBSettings to fetch.
     */
    orderBy?: DBSettingOrderByWithRelationInput | DBSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DBSettings.
     */
    cursor?: DBSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DBSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DBSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DBSettings.
     */
    distinct?: DBSettingScalarFieldEnum | DBSettingScalarFieldEnum[];
  };

  /**
   * DBSetting findFirstOrThrow
   */
  export type DBSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * Filter, which DBSetting to fetch.
     */
    where?: DBSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DBSettings to fetch.
     */
    orderBy?: DBSettingOrderByWithRelationInput | DBSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for DBSettings.
     */
    cursor?: DBSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DBSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DBSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of DBSettings.
     */
    distinct?: DBSettingScalarFieldEnum | DBSettingScalarFieldEnum[];
  };

  /**
   * DBSetting findMany
   */
  export type DBSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * Filter, which DBSettings to fetch.
     */
    where?: DBSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of DBSettings to fetch.
     */
    orderBy?: DBSettingOrderByWithRelationInput | DBSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing DBSettings.
     */
    cursor?: DBSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` DBSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` DBSettings.
     */
    skip?: number;
    distinct?: DBSettingScalarFieldEnum | DBSettingScalarFieldEnum[];
  };

  /**
   * DBSetting create
   */
  export type DBSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * The data needed to create a DBSetting.
     */
    data: XOR<DBSettingCreateInput, DBSettingUncheckedCreateInput>;
  };

  /**
   * DBSetting createMany
   */
  export type DBSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DBSettings.
     */
    data: DBSettingCreateManyInput | DBSettingCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * DBSetting update
   */
  export type DBSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * The data needed to update a DBSetting.
     */
    data: XOR<DBSettingUpdateInput, DBSettingUncheckedUpdateInput>;
    /**
     * Choose, which DBSetting to update.
     */
    where: DBSettingWhereUniqueInput;
  };

  /**
   * DBSetting updateMany
   */
  export type DBSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DBSettings.
     */
    data: XOR<DBSettingUpdateManyMutationInput, DBSettingUncheckedUpdateManyInput>;
    /**
     * Filter which DBSettings to update
     */
    where?: DBSettingWhereInput;
  };

  /**
   * DBSetting upsert
   */
  export type DBSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * The filter to search for the DBSetting to update in case it exists.
     */
    where: DBSettingWhereUniqueInput;
    /**
     * In case the DBSetting found by the `where` argument doesn't exist, create a new DBSetting with this data.
     */
    create: XOR<DBSettingCreateInput, DBSettingUncheckedCreateInput>;
    /**
     * In case the DBSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DBSettingUpdateInput, DBSettingUncheckedUpdateInput>;
  };

  /**
   * DBSetting delete
   */
  export type DBSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
    /**
     * Filter which DBSetting to delete.
     */
    where: DBSettingWhereUniqueInput;
  };

  /**
   * DBSetting deleteMany
   */
  export type DBSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DBSettings to delete
     */
    where?: DBSettingWhereInput;
  };

  /**
   * DBSetting without action
   */
  export type DBSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DBSetting
     */
    select?: DBSettingSelect<ExtArgs> | null;
  };

  /**
   * Model File
   */

  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null;
    _avg: FileAvgAggregateOutputType | null;
    _sum: FileSumAggregateOutputType | null;
    _min: FileMinAggregateOutputType | null;
    _max: FileMaxAggregateOutputType | null;
  };

  export type FileAvgAggregateOutputType = {
    FileId: number | null;
    FileUploadUserId: number | null;
    FileSizeBytes: number | null;
  };

  export type FileSumAggregateOutputType = {
    FileId: number | null;
    FileUploadUserId: number | null;
    FileSizeBytes: bigint | null;
  };

  export type FileMinAggregateOutputType = {
    FileId: number | null;
    FileOriginalFilename: string | null;
    FileMediaType: string | null;
    FileLocation: string | null;
    FileUploadDateTime: Date | null;
    FileUploadUserId: number | null;
    FileSizeBytes: bigint | null;
  };

  export type FileMaxAggregateOutputType = {
    FileId: number | null;
    FileOriginalFilename: string | null;
    FileMediaType: string | null;
    FileLocation: string | null;
    FileUploadDateTime: Date | null;
    FileUploadUserId: number | null;
    FileSizeBytes: bigint | null;
  };

  export type FileCountAggregateOutputType = {
    FileId: number;
    FileOriginalFilename: number;
    FileMediaType: number;
    FileLocation: number;
    FileUploadDateTime: number;
    FileUploadUserId: number;
    FileSizeBytes: number;
    _all: number;
  };

  export type FileAvgAggregateInputType = {
    FileId?: true;
    FileUploadUserId?: true;
    FileSizeBytes?: true;
  };

  export type FileSumAggregateInputType = {
    FileId?: true;
    FileUploadUserId?: true;
    FileSizeBytes?: true;
  };

  export type FileMinAggregateInputType = {
    FileId?: true;
    FileOriginalFilename?: true;
    FileMediaType?: true;
    FileLocation?: true;
    FileUploadDateTime?: true;
    FileUploadUserId?: true;
    FileSizeBytes?: true;
  };

  export type FileMaxAggregateInputType = {
    FileId?: true;
    FileOriginalFilename?: true;
    FileMediaType?: true;
    FileLocation?: true;
    FileUploadDateTime?: true;
    FileUploadUserId?: true;
    FileSizeBytes?: true;
  };

  export type FileCountAggregateInputType = {
    FileId?: true;
    FileOriginalFilename?: true;
    FileMediaType?: true;
    FileLocation?: true;
    FileUploadDateTime?: true;
    FileUploadUserId?: true;
    FileSizeBytes?: true;
    _all?: true;
  };

  export type FileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Files from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Files.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Files
     **/
    _count?: true | FileCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: FileAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: FileSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: FileMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: FileMaxAggregateInputType;
  };

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
    [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>;
  };

  export type FileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput;
    orderBy?: FileOrderByWithAggregationInput | FileOrderByWithAggregationInput[];
    by: FileScalarFieldEnum[] | FileScalarFieldEnum;
    having?: FileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FileCountAggregateInputType | true;
    _avg?: FileAvgAggregateInputType;
    _sum?: FileSumAggregateInputType;
    _min?: FileMinAggregateInputType;
    _max?: FileMaxAggregateInputType;
  };

  export type FileGroupByOutputType = {
    FileId: number;
    FileOriginalFilename: string;
    FileMediaType: string | null;
    FileLocation: string;
    FileUploadDateTime: Date;
    FileUploadUserId: number;
    FileSizeBytes: bigint | null;
    _count: FileCountAggregateOutputType | null;
    _avg: FileAvgAggregateOutputType | null;
    _sum: FileSumAggregateOutputType | null;
    _min: FileMinAggregateOutputType | null;
    _max: FileMaxAggregateOutputType | null;
  };

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileGroupByOutputType, T['by']> & {
        [P in keyof T & keyof FileGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], FileGroupByOutputType[P]>
          : GetScalarType<T[P], FileGroupByOutputType[P]>;
      }
    >
  >;

  export type FileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
    {
      FileId?: boolean;
      FileOriginalFilename?: boolean;
      FileMediaType?: boolean;
      FileLocation?: boolean;
      FileUploadDateTime?: boolean;
      FileUploadUserId?: boolean;
      FileSizeBytes?: boolean;
      Account?: boolean | File$AccountArgs<ExtArgs>;
      User?: boolean | UserDefaultArgs<ExtArgs>;
      ProductionCompany?: boolean | File$ProductionCompanyArgs<ExtArgs>;
      _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['file']
  >;

  export type FileSelectScalar = {
    FileId?: boolean;
    FileOriginalFilename?: boolean;
    FileMediaType?: boolean;
    FileLocation?: boolean;
    FileUploadDateTime?: boolean;
    FileUploadUserId?: boolean;
    FileSizeBytes?: boolean;
  };

  export type FileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | File$AccountArgs<ExtArgs>;
    User?: boolean | UserDefaultArgs<ExtArgs>;
    ProductionCompany?: boolean | File$ProductionCompanyArgs<ExtArgs>;
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $FilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'File';
    objects: {
      Account: Prisma.$AccountPayload<ExtArgs>[];
      User: Prisma.$UserPayload<ExtArgs>;
      ProductionCompany: Prisma.$ProductionCompanyPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        FileId: number;
        FileOriginalFilename: string;
        FileMediaType: string | null;
        FileLocation: string;
        FileUploadDateTime: Date;
        FileUploadUserId: number;
        FileSizeBytes: bigint | null;
      },
      ExtArgs['result']['file']
    >;
    composites: {};
  };

  type FileGetPayload<S extends boolean | null | undefined | FileDefaultArgs> = $Result.GetResult<
    Prisma.$FilePayload,
    S
  >;

  type FileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    FileFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: FileCountAggregateInputType | true;
  };

  export interface FileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['File']; meta: { name: 'File' } };
    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends FileFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, FileFindUniqueArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>;

    /**
     * Find one File that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>;

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends FileFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindFirstArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>;

    /**
     * Find the first File that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>;

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     *
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     *
     * // Only select the `FileId`
     * const fileWithFileIdOnly = await prisma.file.findMany({ select: { FileId: true } })
     *
     **/
    findMany<T extends FileFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     *
     **/
    create<T extends FileCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FileCreateArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'create'>, never, ExtArgs>;

    /**
     * Create many Files.
     *     @param {FileCreateManyArgs} args - Arguments to create many Files.
     *     @example
     *     // Create many Files
     *     const file = await prisma.file.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends FileCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     *
     **/
    delete<T extends FileDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FileDeleteArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>;

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends FileUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FileUpdateArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'update'>, never, ExtArgs>;

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends FileDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends FileUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FileUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
     **/
    upsert<T extends FileUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FileUpsertArgs<ExtArgs>>,
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>;

    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
     **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends FileAggregateArgs>(
      args: Subset<T, FileAggregateArgs>,
    ): Prisma.PrismaPromise<GetFileAggregateType<T>>;

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the File model
     */
    readonly fields: FileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    Account<T extends File$AccountArgs<ExtArgs> = {}>(
      args?: Subset<T, File$AccountArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findMany'> | Null>;

    User<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    ProductionCompany<T extends File$ProductionCompanyArgs<ExtArgs> = {}>(
      args?: Subset<T, File$ProductionCompanyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the File model
   */
  interface FileFieldRefs {
    readonly FileId: FieldRef<'File', 'Int'>;
    readonly FileOriginalFilename: FieldRef<'File', 'String'>;
    readonly FileMediaType: FieldRef<'File', 'String'>;
    readonly FileLocation: FieldRef<'File', 'String'>;
    readonly FileUploadDateTime: FieldRef<'File', 'DateTime'>;
    readonly FileUploadUserId: FieldRef<'File', 'Int'>;
    readonly FileSizeBytes: FieldRef<'File', 'BigInt'>;
  }

  // Custom InputTypes
  /**
   * File findUnique
   */
  export type FileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput;
  };

  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput;
  };

  /**
   * File findFirst
   */
  export type FileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Files from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Files.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[];
  };

  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Files from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Files.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[];
  };

  /**
   * File findMany
   */
  export type FileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Files from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Files.
     */
    skip?: number;
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[];
  };

  /**
   * File create
   */
  export type FileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>;
  };

  /**
   * File createMany
   */
  export type FileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * File update
   */
  export type FileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>;
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput;
  };

  /**
   * File updateMany
   */
  export type FileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>;
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput;
  };

  /**
   * File upsert
   */
  export type FileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput;
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>;
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>;
  };

  /**
   * File delete
   */
  export type FileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput;
  };

  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput;
  };

  /**
   * File.Account
   */
  export type File$AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[];
    cursor?: AccountWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * File.ProductionCompany
   */
  export type File$ProductionCompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    where?: ProductionCompanyWhereInput;
    orderBy?: ProductionCompanyOrderByWithRelationInput | ProductionCompanyOrderByWithRelationInput[];
    cursor?: ProductionCompanyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ProductionCompanyScalarFieldEnum | ProductionCompanyScalarFieldEnum[];
  };

  /**
   * File without action
   */
  export type FileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
  };

  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null;
    _avg: PermissionAvgAggregateOutputType | null;
    _sum: PermissionSumAggregateOutputType | null;
    _min: PermissionMinAggregateOutputType | null;
    _max: PermissionMaxAggregateOutputType | null;
  };

  export type PermissionAvgAggregateOutputType = {
    PermissionId: number | null;
    PermissionParentPermissionId: number | null;
    PermissionSeqNo: number | null;
  };

  export type PermissionSumAggregateOutputType = {
    PermissionId: number | null;
    PermissionParentPermissionId: number | null;
    PermissionSeqNo: number | null;
  };

  export type PermissionMinAggregateOutputType = {
    PermissionId: number | null;
    PermissionParentPermissionId: number | null;
    PermissionName: string | null;
    PermissionDescription: string | null;
    PermissionSeqNo: number | null;
  };

  export type PermissionMaxAggregateOutputType = {
    PermissionId: number | null;
    PermissionParentPermissionId: number | null;
    PermissionName: string | null;
    PermissionDescription: string | null;
    PermissionSeqNo: number | null;
  };

  export type PermissionCountAggregateOutputType = {
    PermissionId: number;
    PermissionParentPermissionId: number;
    PermissionName: number;
    PermissionDescription: number;
    PermissionSeqNo: number;
    _all: number;
  };

  export type PermissionAvgAggregateInputType = {
    PermissionId?: true;
    PermissionParentPermissionId?: true;
    PermissionSeqNo?: true;
  };

  export type PermissionSumAggregateInputType = {
    PermissionId?: true;
    PermissionParentPermissionId?: true;
    PermissionSeqNo?: true;
  };

  export type PermissionMinAggregateInputType = {
    PermissionId?: true;
    PermissionParentPermissionId?: true;
    PermissionName?: true;
    PermissionDescription?: true;
    PermissionSeqNo?: true;
  };

  export type PermissionMaxAggregateInputType = {
    PermissionId?: true;
    PermissionParentPermissionId?: true;
    PermissionName?: true;
    PermissionDescription?: true;
    PermissionSeqNo?: true;
  };

  export type PermissionCountAggregateInputType = {
    PermissionId?: true;
    PermissionParentPermissionId?: true;
    PermissionName?: true;
    PermissionDescription?: true;
    PermissionSeqNo?: true;
    _all?: true;
  };

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Permissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Permissions
     **/
    _count?: true | PermissionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: PermissionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: PermissionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PermissionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PermissionMaxAggregateInputType;
  };

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
    [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>;
  };

  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput;
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[];
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum;
    having?: PermissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PermissionCountAggregateInputType | true;
    _avg?: PermissionAvgAggregateInputType;
    _sum?: PermissionSumAggregateInputType;
    _min?: PermissionMinAggregateInputType;
    _max?: PermissionMaxAggregateInputType;
  };

  export type PermissionGroupByOutputType = {
    PermissionId: number;
    PermissionParentPermissionId: number | null;
    PermissionName: string;
    PermissionDescription: string;
    PermissionSeqNo: number | null;
    _count: PermissionCountAggregateOutputType | null;
    _avg: PermissionAvgAggregateOutputType | null;
    _sum: PermissionSumAggregateOutputType | null;
    _min: PermissionMinAggregateOutputType | null;
    _max: PermissionMaxAggregateOutputType | null;
  };

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof PermissionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
          : GetScalarType<T[P], PermissionGroupByOutputType[P]>;
      }
    >
  >;

  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        PermissionId?: boolean;
        PermissionParentPermissionId?: boolean;
        PermissionName?: boolean;
        PermissionDescription?: boolean;
        PermissionSeqNo?: boolean;
        AccountUserPermission?: boolean | Permission$AccountUserPermissionArgs<ExtArgs>;
        _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['permission']
    >;

  export type PermissionSelectScalar = {
    PermissionId?: boolean;
    PermissionParentPermissionId?: boolean;
    PermissionName?: boolean;
    PermissionDescription?: boolean;
    PermissionSeqNo?: boolean;
  };

  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AccountUserPermission?: boolean | Permission$AccountUserPermissionArgs<ExtArgs>;
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Permission';
    objects: {
      AccountUserPermission: Prisma.$AccountUserPermissionPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        PermissionId: number;
        PermissionParentPermissionId: number | null;
        PermissionName: string;
        PermissionDescription: string;
        PermissionSeqNo: number | null;
      },
      ExtArgs['result']['permission']
    >;
    composites: {};
  };

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<
    Prisma.$PermissionPayload,
    S
  >;

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    PermissionFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: PermissionCountAggregateInputType | true;
  };

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission']; meta: { name: 'Permission' } };
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends PermissionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>,
    ): Prisma__PermissionClient<
      $Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Permission that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__PermissionClient<
      $Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends PermissionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>,
    ): Prisma__PermissionClient<
      $Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__PermissionClient<
      $Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     *
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     *
     * // Only select the `PermissionId`
     * const permissionWithPermissionIdOnly = await prisma.permission.findMany({ select: { PermissionId: true } })
     *
     **/
    findMany<T extends PermissionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     *
     **/
    create<T extends PermissionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>,
    ): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>;

    /**
     * Create many Permissions.
     *     @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     *     @example
     *     // Create many Permissions
     *     const permission = await prisma.permission.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends PermissionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     *
     **/
    delete<T extends PermissionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>,
    ): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>;

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends PermissionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>,
    ): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>;

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends PermissionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends PermissionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     **/
    upsert<T extends PermissionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>,
    ): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>;

    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
     **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PermissionAggregateArgs>(
      args: Subset<T, PermissionAggregateArgs>,
    ): Prisma.PrismaPromise<GetPermissionAggregateType<T>>;

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Permission model
     */
    readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    AccountUserPermission<T extends Permission$AccountUserPermissionArgs<ExtArgs> = {}>(
      args?: Subset<T, Permission$AccountUserPermissionArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountUserPermissionPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Permission model
   */
  interface PermissionFieldRefs {
    readonly PermissionId: FieldRef<'Permission', 'Int'>;
    readonly PermissionParentPermissionId: FieldRef<'Permission', 'Int'>;
    readonly PermissionName: FieldRef<'Permission', 'String'>;
    readonly PermissionDescription: FieldRef<'Permission', 'String'>;
    readonly PermissionSeqNo: FieldRef<'Permission', 'Int'>;
  }

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput;
  };

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput;
  };

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Permissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[];
  };

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Permissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[];
  };

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Permissions.
     */
    skip?: number;
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[];
  };

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>;
  };

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>;
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput;
  };

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>;
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput;
  };

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput;
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>;
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>;
  };

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput;
  };

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput;
  };

  /**
   * Permission.AccountUserPermission
   */
  export type Permission$AccountUserPermissionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the AccountUserPermission
       */
      select?: AccountUserPermissionSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: AccountUserPermissionInclude<ExtArgs> | null;
      where?: AccountUserPermissionWhereInput;
      orderBy?: AccountUserPermissionOrderByWithRelationInput | AccountUserPermissionOrderByWithRelationInput[];
      cursor?: AccountUserPermissionWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: AccountUserPermissionScalarFieldEnum | AccountUserPermissionScalarFieldEnum[];
    };

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null;
  };

  /**
   * Model ProductionCompany
   */

  export type AggregateProductionCompany = {
    _count: ProductionCompanyCountAggregateOutputType | null;
    _avg: ProductionCompanyAvgAggregateOutputType | null;
    _sum: ProductionCompanySumAggregateOutputType | null;
    _min: ProductionCompanyMinAggregateOutputType | null;
    _max: ProductionCompanyMaxAggregateOutputType | null;
  };

  export type ProductionCompanyAvgAggregateOutputType = {
    ProdCoId: number | null;
    ProdCoAccountId: number | null;
    ProdCoSaleStartWeek: number | null;
    ProdCoLogoFileId: number | null;
  };

  export type ProductionCompanySumAggregateOutputType = {
    ProdCoId: number | null;
    ProdCoAccountId: number | null;
    ProdCoSaleStartWeek: number | null;
    ProdCoLogoFileId: number | null;
  };

  export type ProductionCompanyMinAggregateOutputType = {
    ProdCoId: number | null;
    ProdCoAccountId: number | null;
    ProdCoName: string | null;
    ProdCoWebSite: string | null;
    ProdCoSaleStartWeek: number | null;
    ProdCoVATCode: string | null;
    ProdCoLogoFileId: number | null;
  };

  export type ProductionCompanyMaxAggregateOutputType = {
    ProdCoId: number | null;
    ProdCoAccountId: number | null;
    ProdCoName: string | null;
    ProdCoWebSite: string | null;
    ProdCoSaleStartWeek: number | null;
    ProdCoVATCode: string | null;
    ProdCoLogoFileId: number | null;
  };

  export type ProductionCompanyCountAggregateOutputType = {
    ProdCoId: number;
    ProdCoAccountId: number;
    ProdCoName: number;
    ProdCoWebSite: number;
    ProdCoSaleStartWeek: number;
    ProdCoVATCode: number;
    ProdCoLogoFileId: number;
    _all: number;
  };

  export type ProductionCompanyAvgAggregateInputType = {
    ProdCoId?: true;
    ProdCoAccountId?: true;
    ProdCoSaleStartWeek?: true;
    ProdCoLogoFileId?: true;
  };

  export type ProductionCompanySumAggregateInputType = {
    ProdCoId?: true;
    ProdCoAccountId?: true;
    ProdCoSaleStartWeek?: true;
    ProdCoLogoFileId?: true;
  };

  export type ProductionCompanyMinAggregateInputType = {
    ProdCoId?: true;
    ProdCoAccountId?: true;
    ProdCoName?: true;
    ProdCoWebSite?: true;
    ProdCoSaleStartWeek?: true;
    ProdCoVATCode?: true;
    ProdCoLogoFileId?: true;
  };

  export type ProductionCompanyMaxAggregateInputType = {
    ProdCoId?: true;
    ProdCoAccountId?: true;
    ProdCoName?: true;
    ProdCoWebSite?: true;
    ProdCoSaleStartWeek?: true;
    ProdCoVATCode?: true;
    ProdCoLogoFileId?: true;
  };

  export type ProductionCompanyCountAggregateInputType = {
    ProdCoId?: true;
    ProdCoAccountId?: true;
    ProdCoName?: true;
    ProdCoWebSite?: true;
    ProdCoSaleStartWeek?: true;
    ProdCoVATCode?: true;
    ProdCoLogoFileId?: true;
    _all?: true;
  };

  export type ProductionCompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionCompany to aggregate.
     */
    where?: ProductionCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductionCompanies to fetch.
     */
    orderBy?: ProductionCompanyOrderByWithRelationInput | ProductionCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProductionCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductionCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductionCompanies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProductionCompanies
     **/
    _count?: true | ProductionCompanyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProductionCompanyAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProductionCompanySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProductionCompanyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProductionCompanyMaxAggregateInputType;
  };

  export type GetProductionCompanyAggregateType<T extends ProductionCompanyAggregateArgs> = {
    [P in keyof T & keyof AggregateProductionCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductionCompany[P]>
      : GetScalarType<T[P], AggregateProductionCompany[P]>;
  };

  export type ProductionCompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductionCompanyWhereInput;
    orderBy?: ProductionCompanyOrderByWithAggregationInput | ProductionCompanyOrderByWithAggregationInput[];
    by: ProductionCompanyScalarFieldEnum[] | ProductionCompanyScalarFieldEnum;
    having?: ProductionCompanyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductionCompanyCountAggregateInputType | true;
    _avg?: ProductionCompanyAvgAggregateInputType;
    _sum?: ProductionCompanySumAggregateInputType;
    _min?: ProductionCompanyMinAggregateInputType;
    _max?: ProductionCompanyMaxAggregateInputType;
  };

  export type ProductionCompanyGroupByOutputType = {
    ProdCoId: number;
    ProdCoAccountId: number;
    ProdCoName: string;
    ProdCoWebSite: string | null;
    ProdCoSaleStartWeek: number | null;
    ProdCoVATCode: string | null;
    ProdCoLogoFileId: number | null;
    _count: ProductionCompanyCountAggregateOutputType | null;
    _avg: ProductionCompanyAvgAggregateOutputType | null;
    _sum: ProductionCompanySumAggregateOutputType | null;
    _min: ProductionCompanyMinAggregateOutputType | null;
    _max: ProductionCompanyMaxAggregateOutputType | null;
  };

  type GetProductionCompanyGroupByPayload<T extends ProductionCompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductionCompanyGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProductionCompanyGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProductionCompanyGroupByOutputType[P]>
          : GetScalarType<T[P], ProductionCompanyGroupByOutputType[P]>;
      }
    >
  >;

  export type ProductionCompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        ProdCoId?: boolean;
        ProdCoAccountId?: boolean;
        ProdCoName?: boolean;
        ProdCoWebSite?: boolean;
        ProdCoSaleStartWeek?: boolean;
        ProdCoVATCode?: boolean;
        ProdCoLogoFileId?: boolean;
        Account?: boolean | AccountDefaultArgs<ExtArgs>;
        File?: boolean | ProductionCompany$FileArgs<ExtArgs>;
      },
      ExtArgs['result']['productionCompany']
    >;

  export type ProductionCompanySelectScalar = {
    ProdCoId?: boolean;
    ProdCoAccountId?: boolean;
    ProdCoName?: boolean;
    ProdCoWebSite?: boolean;
    ProdCoSaleStartWeek?: boolean;
    ProdCoVATCode?: boolean;
    ProdCoLogoFileId?: boolean;
  };

  export type ProductionCompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Account?: boolean | AccountDefaultArgs<ExtArgs>;
    File?: boolean | ProductionCompany$FileArgs<ExtArgs>;
  };

  export type $ProductionCompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'ProductionCompany';
    objects: {
      Account: Prisma.$AccountPayload<ExtArgs>;
      File: Prisma.$FilePayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        ProdCoId: number;
        ProdCoAccountId: number;
        ProdCoName: string;
        ProdCoWebSite: string | null;
        ProdCoSaleStartWeek: number | null;
        ProdCoVATCode: string | null;
        ProdCoLogoFileId: number | null;
      },
      ExtArgs['result']['productionCompany']
    >;
    composites: {};
  };

  type ProductionCompanyGetPayload<S extends boolean | null | undefined | ProductionCompanyDefaultArgs> =
    $Result.GetResult<Prisma.$ProductionCompanyPayload, S>;

  type ProductionCompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    ProductionCompanyFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: ProductionCompanyCountAggregateInputType | true;
  };

  export interface ProductionCompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductionCompany']; meta: { name: 'ProductionCompany' } };
    /**
     * Find zero or one ProductionCompany that matches the filter.
     * @param {ProductionCompanyFindUniqueArgs} args - Arguments to find a ProductionCompany
     * @example
     * // Get one ProductionCompany
     * const productionCompany = await prisma.productionCompany.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends ProductionCompanyFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, ProductionCompanyFindUniqueArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one ProductionCompany that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {ProductionCompanyFindUniqueOrThrowArgs} args - Arguments to find a ProductionCompany
     * @example
     * // Get one ProductionCompany
     * const productionCompany = await prisma.productionCompany.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends ProductionCompanyFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ProductionCompanyFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first ProductionCompany that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionCompanyFindFirstArgs} args - Arguments to find a ProductionCompany
     * @example
     * // Get one ProductionCompany
     * const productionCompany = await prisma.productionCompany.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends ProductionCompanyFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, ProductionCompanyFindFirstArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first ProductionCompany that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionCompanyFindFirstOrThrowArgs} args - Arguments to find a ProductionCompany
     * @example
     * // Get one ProductionCompany
     * const productionCompany = await prisma.productionCompany.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends ProductionCompanyFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ProductionCompanyFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more ProductionCompanies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionCompanyFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductionCompanies
     * const productionCompanies = await prisma.productionCompany.findMany()
     *
     * // Get first 10 ProductionCompanies
     * const productionCompanies = await prisma.productionCompany.findMany({ take: 10 })
     *
     * // Only select the `ProdCoId`
     * const productionCompanyWithProdCoIdOnly = await prisma.productionCompany.findMany({ select: { ProdCoId: true } })
     *
     **/
    findMany<T extends ProductionCompanyFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ProductionCompanyFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a ProductionCompany.
     * @param {ProductionCompanyCreateArgs} args - Arguments to create a ProductionCompany.
     * @example
     * // Create one ProductionCompany
     * const ProductionCompany = await prisma.productionCompany.create({
     *   data: {
     *     // ... data to create a ProductionCompany
     *   }
     * })
     *
     **/
    create<T extends ProductionCompanyCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ProductionCompanyCreateArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many ProductionCompanies.
     *     @param {ProductionCompanyCreateManyArgs} args - Arguments to create many ProductionCompanies.
     *     @example
     *     // Create many ProductionCompanies
     *     const productionCompany = await prisma.productionCompany.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends ProductionCompanyCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ProductionCompanyCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a ProductionCompany.
     * @param {ProductionCompanyDeleteArgs} args - Arguments to delete one ProductionCompany.
     * @example
     * // Delete one ProductionCompany
     * const ProductionCompany = await prisma.productionCompany.delete({
     *   where: {
     *     // ... filter to delete one ProductionCompany
     *   }
     * })
     *
     **/
    delete<T extends ProductionCompanyDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ProductionCompanyDeleteArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one ProductionCompany.
     * @param {ProductionCompanyUpdateArgs} args - Arguments to update one ProductionCompany.
     * @example
     * // Update one ProductionCompany
     * const productionCompany = await prisma.productionCompany.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends ProductionCompanyUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ProductionCompanyUpdateArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more ProductionCompanies.
     * @param {ProductionCompanyDeleteManyArgs} args - Arguments to filter ProductionCompanies to delete.
     * @example
     * // Delete a few ProductionCompanies
     * const { count } = await prisma.productionCompany.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends ProductionCompanyDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ProductionCompanyDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProductionCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionCompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductionCompanies
     * const productionCompany = await prisma.productionCompany.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends ProductionCompanyUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ProductionCompanyUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one ProductionCompany.
     * @param {ProductionCompanyUpsertArgs} args - Arguments to update or create a ProductionCompany.
     * @example
     * // Update or create a ProductionCompany
     * const productionCompany = await prisma.productionCompany.upsert({
     *   create: {
     *     // ... data to create a ProductionCompany
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductionCompany we want to update
     *   }
     * })
     **/
    upsert<T extends ProductionCompanyUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ProductionCompanyUpsertArgs<ExtArgs>>,
    ): Prisma__ProductionCompanyClient<
      $Result.GetResult<Prisma.$ProductionCompanyPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of ProductionCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionCompanyCountArgs} args - Arguments to filter ProductionCompanies to count.
     * @example
     * // Count the number of ProductionCompanies
     * const count = await prisma.productionCompany.count({
     *   where: {
     *     // ... the filter for the ProductionCompanies we want to count
     *   }
     * })
     **/
    count<T extends ProductionCompanyCountArgs>(
      args?: Subset<T, ProductionCompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductionCompanyCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ProductionCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionCompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProductionCompanyAggregateArgs>(
      args: Subset<T, ProductionCompanyAggregateArgs>,
    ): Prisma.PrismaPromise<GetProductionCompanyAggregateType<T>>;

    /**
     * Group by ProductionCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductionCompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProductionCompanyGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductionCompanyGroupByArgs['orderBy'] }
        : { orderBy?: ProductionCompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, ProductionCompanyGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetProductionCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ProductionCompany model
     */
    readonly fields: ProductionCompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductionCompany.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductionCompanyClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    Account<T extends AccountDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AccountDefaultArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null,
      Null,
      ExtArgs
    >;

    File<T extends ProductionCompany$FileArgs<ExtArgs> = {}>(
      args?: Subset<T, ProductionCompany$FileArgs<ExtArgs>>,
    ): Prisma__FileClient<
      $Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findUniqueOrThrow'> | null,
      null,
      ExtArgs
    >;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ProductionCompany model
   */
  interface ProductionCompanyFieldRefs {
    readonly ProdCoId: FieldRef<'ProductionCompany', 'Int'>;
    readonly ProdCoAccountId: FieldRef<'ProductionCompany', 'Int'>;
    readonly ProdCoName: FieldRef<'ProductionCompany', 'String'>;
    readonly ProdCoWebSite: FieldRef<'ProductionCompany', 'String'>;
    readonly ProdCoSaleStartWeek: FieldRef<'ProductionCompany', 'Int'>;
    readonly ProdCoVATCode: FieldRef<'ProductionCompany', 'String'>;
    readonly ProdCoLogoFileId: FieldRef<'ProductionCompany', 'Int'>;
  }

  // Custom InputTypes
  /**
   * ProductionCompany findUnique
   */
  export type ProductionCompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which ProductionCompany to fetch.
     */
    where: ProductionCompanyWhereUniqueInput;
  };

  /**
   * ProductionCompany findUniqueOrThrow
   */
  export type ProductionCompanyFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which ProductionCompany to fetch.
     */
    where: ProductionCompanyWhereUniqueInput;
  };

  /**
   * ProductionCompany findFirst
   */
  export type ProductionCompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which ProductionCompany to fetch.
     */
    where?: ProductionCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductionCompanies to fetch.
     */
    orderBy?: ProductionCompanyOrderByWithRelationInput | ProductionCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductionCompanies.
     */
    cursor?: ProductionCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductionCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductionCompanies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductionCompanies.
     */
    distinct?: ProductionCompanyScalarFieldEnum | ProductionCompanyScalarFieldEnum[];
  };

  /**
   * ProductionCompany findFirstOrThrow
   */
  export type ProductionCompanyFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which ProductionCompany to fetch.
     */
    where?: ProductionCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductionCompanies to fetch.
     */
    orderBy?: ProductionCompanyOrderByWithRelationInput | ProductionCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductionCompanies.
     */
    cursor?: ProductionCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductionCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductionCompanies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductionCompanies.
     */
    distinct?: ProductionCompanyScalarFieldEnum | ProductionCompanyScalarFieldEnum[];
  };

  /**
   * ProductionCompany findMany
   */
  export type ProductionCompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which ProductionCompanies to fetch.
     */
    where?: ProductionCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductionCompanies to fetch.
     */
    orderBy?: ProductionCompanyOrderByWithRelationInput | ProductionCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProductionCompanies.
     */
    cursor?: ProductionCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductionCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductionCompanies.
     */
    skip?: number;
    distinct?: ProductionCompanyScalarFieldEnum | ProductionCompanyScalarFieldEnum[];
  };

  /**
   * ProductionCompany create
   */
  export type ProductionCompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * The data needed to create a ProductionCompany.
     */
    data: XOR<ProductionCompanyCreateInput, ProductionCompanyUncheckedCreateInput>;
  };

  /**
   * ProductionCompany createMany
   */
  export type ProductionCompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductionCompanies.
     */
    data: ProductionCompanyCreateManyInput | ProductionCompanyCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ProductionCompany update
   */
  export type ProductionCompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * The data needed to update a ProductionCompany.
     */
    data: XOR<ProductionCompanyUpdateInput, ProductionCompanyUncheckedUpdateInput>;
    /**
     * Choose, which ProductionCompany to update.
     */
    where: ProductionCompanyWhereUniqueInput;
  };

  /**
   * ProductionCompany updateMany
   */
  export type ProductionCompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductionCompanies.
     */
    data: XOR<ProductionCompanyUpdateManyMutationInput, ProductionCompanyUncheckedUpdateManyInput>;
    /**
     * Filter which ProductionCompanies to update
     */
    where?: ProductionCompanyWhereInput;
  };

  /**
   * ProductionCompany upsert
   */
  export type ProductionCompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * The filter to search for the ProductionCompany to update in case it exists.
     */
    where: ProductionCompanyWhereUniqueInput;
    /**
     * In case the ProductionCompany found by the `where` argument doesn't exist, create a new ProductionCompany with this data.
     */
    create: XOR<ProductionCompanyCreateInput, ProductionCompanyUncheckedCreateInput>;
    /**
     * In case the ProductionCompany was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductionCompanyUpdateInput, ProductionCompanyUncheckedUpdateInput>;
  };

  /**
   * ProductionCompany delete
   */
  export type ProductionCompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
    /**
     * Filter which ProductionCompany to delete.
     */
    where: ProductionCompanyWhereUniqueInput;
  };

  /**
   * ProductionCompany deleteMany
   */
  export type ProductionCompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductionCompanies to delete
     */
    where?: ProductionCompanyWhereInput;
  };

  /**
   * ProductionCompany.File
   */
  export type ProductionCompany$FileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    where?: FileWhereInput;
  };

  /**
   * ProductionCompany without action
   */
  export type ProductionCompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductionCompany
     */
    select?: ProductionCompanySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductionCompanyInclude<ExtArgs> | null;
  };

  /**
   * Model SubscriptionPlan
   */

  export type AggregateSubscriptionPlan = {
    _count: SubscriptionPlanCountAggregateOutputType | null;
    _avg: SubscriptionPlanAvgAggregateOutputType | null;
    _sum: SubscriptionPlanSumAggregateOutputType | null;
    _min: SubscriptionPlanMinAggregateOutputType | null;
    _max: SubscriptionPlanMaxAggregateOutputType | null;
  };

  export type SubscriptionPlanAvgAggregateOutputType = {
    PlanId: number | null;
    PlanPrice: Decimal | null;
    PlanFrequency: number | null;
  };

  export type SubscriptionPlanSumAggregateOutputType = {
    PlanId: number | null;
    PlanPrice: Decimal | null;
    PlanFrequency: number | null;
  };

  export type SubscriptionPlanMinAggregateOutputType = {
    PlanId: number | null;
    PlanName: string | null;
    PlanDescription: string | null;
    PlanPrice: Decimal | null;
    PlanFrequency: number | null;
    PlanPriceId: string | null;
    PlanCurrency: string | null;
  };

  export type SubscriptionPlanMaxAggregateOutputType = {
    PlanId: number | null;
    PlanName: string | null;
    PlanDescription: string | null;
    PlanPrice: Decimal | null;
    PlanFrequency: number | null;
    PlanPriceId: string | null;
    PlanCurrency: string | null;
  };

  export type SubscriptionPlanCountAggregateOutputType = {
    PlanId: number;
    PlanName: number;
    PlanDescription: number;
    PlanPrice: number;
    PlanFrequency: number;
    PlanPriceId: number;
    PlanCurrency: number;
    _all: number;
  };

  export type SubscriptionPlanAvgAggregateInputType = {
    PlanId?: true;
    PlanPrice?: true;
    PlanFrequency?: true;
  };

  export type SubscriptionPlanSumAggregateInputType = {
    PlanId?: true;
    PlanPrice?: true;
    PlanFrequency?: true;
  };

  export type SubscriptionPlanMinAggregateInputType = {
    PlanId?: true;
    PlanName?: true;
    PlanDescription?: true;
    PlanPrice?: true;
    PlanFrequency?: true;
    PlanPriceId?: true;
    PlanCurrency?: true;
  };

  export type SubscriptionPlanMaxAggregateInputType = {
    PlanId?: true;
    PlanName?: true;
    PlanDescription?: true;
    PlanPrice?: true;
    PlanFrequency?: true;
    PlanPriceId?: true;
    PlanCurrency?: true;
  };

  export type SubscriptionPlanCountAggregateInputType = {
    PlanId?: true;
    PlanName?: true;
    PlanDescription?: true;
    PlanPrice?: true;
    PlanFrequency?: true;
    PlanPriceId?: true;
    PlanCurrency?: true;
    _all?: true;
  };

  export type SubscriptionPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlan to aggregate.
     */
    where?: SubscriptionPlanWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SubscriptionPlanWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SubscriptionPlans
     **/
    _count?: true | SubscriptionPlanCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: SubscriptionPlanAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: SubscriptionPlanSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SubscriptionPlanMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SubscriptionPlanMaxAggregateInputType;
  };

  export type GetSubscriptionPlanAggregateType<T extends SubscriptionPlanAggregateArgs> = {
    [P in keyof T & keyof AggregateSubscriptionPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPlan[P]>
      : GetScalarType<T[P], AggregateSubscriptionPlan[P]>;
  };

  export type SubscriptionPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanWhereInput;
    orderBy?: SubscriptionPlanOrderByWithAggregationInput | SubscriptionPlanOrderByWithAggregationInput[];
    by: SubscriptionPlanScalarFieldEnum[] | SubscriptionPlanScalarFieldEnum;
    having?: SubscriptionPlanScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionPlanCountAggregateInputType | true;
    _avg?: SubscriptionPlanAvgAggregateInputType;
    _sum?: SubscriptionPlanSumAggregateInputType;
    _min?: SubscriptionPlanMinAggregateInputType;
    _max?: SubscriptionPlanMaxAggregateInputType;
  };

  export type SubscriptionPlanGroupByOutputType = {
    PlanId: number;
    PlanName: string;
    PlanDescription: string | null;
    PlanPrice: Decimal;
    PlanFrequency: number;
    PlanPriceId: string | null;
    PlanCurrency: string;
    _count: SubscriptionPlanCountAggregateOutputType | null;
    _avg: SubscriptionPlanAvgAggregateOutputType | null;
    _sum: SubscriptionPlanSumAggregateOutputType | null;
    _min: SubscriptionPlanMinAggregateOutputType | null;
    _max: SubscriptionPlanMaxAggregateOutputType | null;
  };

  type GetSubscriptionPlanGroupByPayload<T extends SubscriptionPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionPlanGroupByOutputType, T['by']> & {
        [P in keyof T & keyof SubscriptionPlanGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>
          : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>;
      }
    >
  >;

  export type SubscriptionPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        PlanId?: boolean;
        PlanName?: boolean;
        PlanDescription?: boolean;
        PlanPrice?: boolean;
        PlanFrequency?: boolean;
        PlanPriceId?: boolean;
        PlanCurrency?: boolean;
        AccountSubscription?: boolean | SubscriptionPlan$AccountSubscriptionArgs<ExtArgs>;
        _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['subscriptionPlan']
    >;

  export type SubscriptionPlanSelectScalar = {
    PlanId?: boolean;
    PlanName?: boolean;
    PlanDescription?: boolean;
    PlanPrice?: boolean;
    PlanFrequency?: boolean;
    PlanPriceId?: boolean;
    PlanCurrency?: boolean;
  };

  export type SubscriptionPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AccountSubscription?: boolean | SubscriptionPlan$AccountSubscriptionArgs<ExtArgs>;
    _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $SubscriptionPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'SubscriptionPlan';
    objects: {
      AccountSubscription: Prisma.$AccountSubscriptionPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        PlanId: number;
        PlanName: string;
        PlanDescription: string | null;
        PlanPrice: Prisma.Decimal;
        PlanFrequency: number;
        PlanPriceId: string | null;
        PlanCurrency: string;
      },
      ExtArgs['result']['subscriptionPlan']
    >;
    composites: {};
  };

  type SubscriptionPlanGetPayload<S extends boolean | null | undefined | SubscriptionPlanDefaultArgs> =
    $Result.GetResult<Prisma.$SubscriptionPlanPayload, S>;

  type SubscriptionPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    SubscriptionPlanFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: SubscriptionPlanCountAggregateInputType | true;
  };

  export interface SubscriptionPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPlan']; meta: { name: 'SubscriptionPlan' } };
    /**
     * Find zero or one SubscriptionPlan that matches the filter.
     * @param {SubscriptionPlanFindUniqueArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends SubscriptionPlanFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPlanFindUniqueArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one SubscriptionPlan that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {SubscriptionPlanFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first SubscriptionPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends SubscriptionPlanFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPlanFindFirstArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first SubscriptionPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more SubscriptionPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
     *
     * // Get first 10 SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany({ take: 10 })
     *
     * // Only select the `PlanId`
     * const subscriptionPlanWithPlanIdOnly = await prisma.subscriptionPlan.findMany({ select: { PlanId: true } })
     *
     **/
    findMany<T extends SubscriptionPlanFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPlanFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a SubscriptionPlan.
     * @param {SubscriptionPlanCreateArgs} args - Arguments to create a SubscriptionPlan.
     * @example
     * // Create one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.create({
     *   data: {
     *     // ... data to create a SubscriptionPlan
     *   }
     * })
     *
     **/
    create<T extends SubscriptionPlanCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPlanCreateArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many SubscriptionPlans.
     *     @param {SubscriptionPlanCreateManyArgs} args - Arguments to create many SubscriptionPlans.
     *     @example
     *     // Create many SubscriptionPlans
     *     const subscriptionPlan = await prisma.subscriptionPlan.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends SubscriptionPlanCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPlanCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a SubscriptionPlan.
     * @param {SubscriptionPlanDeleteArgs} args - Arguments to delete one SubscriptionPlan.
     * @example
     * // Delete one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPlan
     *   }
     * })
     *
     **/
    delete<T extends SubscriptionPlanDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPlanDeleteArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one SubscriptionPlan.
     * @param {SubscriptionPlanUpdateArgs} args - Arguments to update one SubscriptionPlan.
     * @example
     * // Update one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends SubscriptionPlanUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPlanUpdateArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more SubscriptionPlans.
     * @param {SubscriptionPlanDeleteManyArgs} args - Arguments to filter SubscriptionPlans to delete.
     * @example
     * // Delete a few SubscriptionPlans
     * const { count } = await prisma.subscriptionPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends SubscriptionPlanDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SubscriptionPlanDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends SubscriptionPlanUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPlanUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one SubscriptionPlan.
     * @param {SubscriptionPlanUpsertArgs} args - Arguments to update or create a SubscriptionPlan.
     * @example
     * // Update or create a SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPlan we want to update
     *   }
     * })
     **/
    upsert<T extends SubscriptionPlanUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SubscriptionPlanUpsertArgs<ExtArgs>>,
    ): Prisma__SubscriptionPlanClient<
      $Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanCountArgs} args - Arguments to filter SubscriptionPlans to count.
     * @example
     * // Count the number of SubscriptionPlans
     * const count = await prisma.subscriptionPlan.count({
     *   where: {
     *     // ... the filter for the SubscriptionPlans we want to count
     *   }
     * })
     **/
    count<T extends SubscriptionPlanCountArgs>(
      args?: Subset<T, SubscriptionPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPlanCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SubscriptionPlanAggregateArgs>(
      args: Subset<T, SubscriptionPlanAggregateArgs>,
    ): Prisma.PrismaPromise<GetSubscriptionPlanAggregateType<T>>;

    /**
     * Group by SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SubscriptionPlanGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPlanGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, SubscriptionPlanGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetSubscriptionPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SubscriptionPlan model
     */
    readonly fields: SubscriptionPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionPlanClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    AccountSubscription<T extends SubscriptionPlan$AccountSubscriptionArgs<ExtArgs> = {}>(
      args?: Subset<T, SubscriptionPlan$AccountSubscriptionArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountSubscriptionPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the SubscriptionPlan model
   */
  interface SubscriptionPlanFieldRefs {
    readonly PlanId: FieldRef<'SubscriptionPlan', 'Int'>;
    readonly PlanName: FieldRef<'SubscriptionPlan', 'String'>;
    readonly PlanDescription: FieldRef<'SubscriptionPlan', 'String'>;
    readonly PlanPrice: FieldRef<'SubscriptionPlan', 'Decimal'>;
    readonly PlanFrequency: FieldRef<'SubscriptionPlan', 'Int'>;
    readonly PlanPriceId: FieldRef<'SubscriptionPlan', 'String'>;
    readonly PlanCurrency: FieldRef<'SubscriptionPlan', 'String'>;
  }

  // Custom InputTypes
  /**
   * SubscriptionPlan findUnique
   */
  export type SubscriptionPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput;
  };

  /**
   * SubscriptionPlan findUniqueOrThrow
   */
  export type SubscriptionPlanFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput;
  };

  /**
   * SubscriptionPlan findFirst
   */
  export type SubscriptionPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where?: SubscriptionPlanWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SubscriptionPlans.
     */
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[];
  };

  /**
   * SubscriptionPlan findFirstOrThrow
   */
  export type SubscriptionPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the SubscriptionPlan
       */
      select?: SubscriptionPlanSelect<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: SubscriptionPlanInclude<ExtArgs> | null;
      /**
       * Filter, which SubscriptionPlan to fetch.
       */
      where?: SubscriptionPlanWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of SubscriptionPlans to fetch.
       */
      orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for SubscriptionPlans.
       */
      cursor?: SubscriptionPlanWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` SubscriptionPlans from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` SubscriptionPlans.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of SubscriptionPlans.
       */
      distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[];
    };

  /**
   * SubscriptionPlan findMany
   */
  export type SubscriptionPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlans to fetch.
     */
    where?: SubscriptionPlanWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number;
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[];
  };

  /**
   * SubscriptionPlan create
   */
  export type SubscriptionPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * The data needed to create a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>;
  };

  /**
   * SubscriptionPlan createMany
   */
  export type SubscriptionPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPlans.
     */
    data: SubscriptionPlanCreateManyInput | SubscriptionPlanCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * SubscriptionPlan update
   */
  export type SubscriptionPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * The data needed to update a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>;
    /**
     * Choose, which SubscriptionPlan to update.
     */
    where: SubscriptionPlanWhereUniqueInput;
  };

  /**
   * SubscriptionPlan updateMany
   */
  export type SubscriptionPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPlans.
     */
    data: XOR<SubscriptionPlanUpdateManyMutationInput, SubscriptionPlanUncheckedUpdateManyInput>;
    /**
     * Filter which SubscriptionPlans to update
     */
    where?: SubscriptionPlanWhereInput;
  };

  /**
   * SubscriptionPlan upsert
   */
  export type SubscriptionPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * The filter to search for the SubscriptionPlan to update in case it exists.
     */
    where: SubscriptionPlanWhereUniqueInput;
    /**
     * In case the SubscriptionPlan found by the `where` argument doesn't exist, create a new SubscriptionPlan with this data.
     */
    create: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>;
    /**
     * In case the SubscriptionPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>;
  };

  /**
   * SubscriptionPlan delete
   */
  export type SubscriptionPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
    /**
     * Filter which SubscriptionPlan to delete.
     */
    where: SubscriptionPlanWhereUniqueInput;
  };

  /**
   * SubscriptionPlan deleteMany
   */
  export type SubscriptionPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlans to delete
     */
    where?: SubscriptionPlanWhereInput;
  };

  /**
   * SubscriptionPlan.AccountSubscription
   */
  export type SubscriptionPlan$AccountSubscriptionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AccountSubscription
     */
    select?: AccountSubscriptionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountSubscriptionInclude<ExtArgs> | null;
    where?: AccountSubscriptionWhereInput;
    orderBy?: AccountSubscriptionOrderByWithRelationInput | AccountSubscriptionOrderByWithRelationInput[];
    cursor?: AccountSubscriptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AccountSubscriptionScalarFieldEnum | AccountSubscriptionScalarFieldEnum[];
  };

  /**
   * SubscriptionPlan without action
   */
  export type SubscriptionPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null;
  };

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserAvgAggregateOutputType = {
    UserId: number | null;
  };

  export type UserSumAggregateOutputType = {
    UserId: number | null;
  };

  export type UserMinAggregateOutputType = {
    UserId: number | null;
    UserEmail: string | null;
    UserFirstName: string | null;
    UserLastName: string | null;
  };

  export type UserMaxAggregateOutputType = {
    UserId: number | null;
    UserEmail: string | null;
    UserFirstName: string | null;
    UserLastName: string | null;
  };

  export type UserCountAggregateOutputType = {
    UserId: number;
    UserEmail: number;
    UserFirstName: number;
    UserLastName: number;
    _all: number;
  };

  export type UserAvgAggregateInputType = {
    UserId?: true;
  };

  export type UserSumAggregateInputType = {
    UserId?: true;
  };

  export type UserMinAggregateInputType = {
    UserId?: true;
    UserEmail?: true;
    UserFirstName?: true;
    UserLastName?: true;
  };

  export type UserMaxAggregateInputType = {
    UserId?: true;
    UserEmail?: true;
    UserFirstName?: true;
    UserLastName?: true;
  };

  export type UserCountAggregateInputType = {
    UserId?: true;
    UserEmail?: true;
    UserFirstName?: true;
    UserLastName?: true;
    _all?: true;
  };

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: UserAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: UserSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput;
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
    by: UserScalarFieldEnum[] | UserScalarFieldEnum;
    having?: UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };

  export type UserGroupByOutputType = {
    UserId: number;
    UserEmail: string;
    UserFirstName: string;
    UserLastName: string | null;
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
    {
      UserId?: boolean;
      UserEmail?: boolean;
      UserFirstName?: boolean;
      UserLastName?: boolean;
      AccountUser?: boolean | User$AccountUserArgs<ExtArgs>;
      File?: boolean | User$FileArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    UserId?: boolean;
    UserEmail?: boolean;
    UserFirstName?: boolean;
    UserLastName?: boolean;
  };

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    AccountUser?: boolean | User$AccountUserArgs<ExtArgs>;
    File?: boolean | User$FileArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'User';
    objects: {
      AccountUser: Prisma.$AccountUserPayload<ExtArgs> | null;
      File: Prisma.$FilePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        UserId: number;
        UserEmail: string;
        UserFirstName: string;
        UserLastName: string | null;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
    Prisma.$UserPayload,
    S
  >;

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    UserFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User']; meta: { name: 'User' } };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUnique<T extends UserFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>;

    /**
     * Find one User that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirst<T extends UserFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `UserId`
     * const userWithUserIdOnly = await prisma.user.findMany({ select: { UserId: true } })
     *
     **/
    findMany<T extends UserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany'>>;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     **/
    create<T extends UserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create'>, never, ExtArgs>;

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *
     **/
    createMany<T extends UserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     **/
    delete<T extends UserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    update<T extends UserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update'>, never, ExtArgs>;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     **/
    deleteMany<T extends UserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     **/
    updateMany<T extends UserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     **/
    upsert<T extends UserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
        ? {
            [P in HavingFields]: P extends ByFields
              ? never
              : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
          }[HavingFields]
        : 'take' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Keys<T>
        ? 'orderBy' extends Keys<T>
          ? ByValid extends True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
          }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    AccountUser<T extends User$AccountUserArgs<ExtArgs> = {}>(
      args?: Subset<T, User$AccountUserArgs<ExtArgs>>,
    ): Prisma__AccountUserClient<
      $Result.GetResult<Prisma.$AccountUserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null,
      null,
      ExtArgs
    >;

    File<T extends User$FileArgs<ExtArgs> = {}>(
      args?: Subset<T, User$FileArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly UserId: FieldRef<'User', 'Int'>;
    readonly UserEmail: FieldRef<'User', 'String'>;
    readonly UserFirstName: FieldRef<'User', 'String'>;
    readonly UserLastName: FieldRef<'User', 'String'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
  };

  /**
   * User.AccountUser
   */
  export type User$AccountUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountUser
     */
    select?: AccountUserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountUserInclude<ExtArgs> | null;
    where?: AccountUserWhereInput;
  };

  /**
   * User.File
   */
  export type User$FileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null;
    where?: FileWhereInput;
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[];
    cursor?: FileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const AccountScalarFieldEnum: {
    AccountId: 'AccountId';
    AccountName: 'AccountName';
    AccountAddress1: 'AccountAddress1';
    AccountAddress2: 'AccountAddress2';
    AccountAddress3: 'AccountAddress3';
    AccountAddressTown: 'AccountAddressTown';
    AccountAddressCounty: 'AccountAddressCounty';
    AccountAddressPostcode: 'AccountAddressPostcode';
    AccountAddressCountry: 'AccountAddressCountry';
    AccountVATNumber: 'AccountVATNumber';
    AccountCurrencyCode: 'AccountCurrencyCode';
    AccountCompanyNumber: 'AccountCompanyNumber';
    AccountLogoFileId: 'AccountLogoFileId';
    AccountMainEmail: 'AccountMainEmail';
    AccountNumPeople: 'AccountNumPeople';
    AccountOrganisationId: 'AccountOrganisationId';
    AccountTermsAgreedBy: 'AccountTermsAgreedBy';
    AccountTermsAgreedDate: 'AccountTermsAgreedDate';
    AccountWebsite: 'AccountWebsite';
    AccountTypeOfCompany: 'AccountTypeOfCompany';
    AccountPhone: 'AccountPhone';
    AccountPaymentCurrencyCode: 'AccountPaymentCurrencyCode';
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];

  export const AccountContactScalarFieldEnum: {
    AccContId: 'AccContId';
    AccContAccountId: 'AccContAccountId';
    AccContFirstName: 'AccContFirstName';
    AccContLastName: 'AccContLastName';
    AccContPhone: 'AccContPhone';
    AccContMainEmail: 'AccContMainEmail';
  };

  export type AccountContactScalarFieldEnum =
    (typeof AccountContactScalarFieldEnum)[keyof typeof AccountContactScalarFieldEnum];

  export const AccountSubscriptionScalarFieldEnum: {
    AccSubId: 'AccSubId';
    AccSubAccountId: 'AccSubAccountId';
    AccSubPlanId: 'AccSubPlanId';
    AccSubStartDate: 'AccSubStartDate';
    AccSubEndDate: 'AccSubEndDate';
    AccSubIsActive: 'AccSubIsActive';
  };

  export type AccountSubscriptionScalarFieldEnum =
    (typeof AccountSubscriptionScalarFieldEnum)[keyof typeof AccountSubscriptionScalarFieldEnum];

  export const AccountUserScalarFieldEnum: {
    AccUserId: 'AccUserId';
    AccUserUserId: 'AccUserUserId';
    AccUserAccountId: 'AccUserAccountId';
    AccUserIsAdmin: 'AccUserIsAdmin';
    AccUserPIN: 'AccUserPIN';
  };

  export type AccountUserScalarFieldEnum = (typeof AccountUserScalarFieldEnum)[keyof typeof AccountUserScalarFieldEnum];

  export const AccountUserPermissionScalarFieldEnum: {
    UserAuthId: 'UserAuthId';
    UserAuthAccUserId: 'UserAuthAccUserId';
    UserAuthPermissionId: 'UserAuthPermissionId';
  };

  export type AccountUserPermissionScalarFieldEnum =
    (typeof AccountUserPermissionScalarFieldEnum)[keyof typeof AccountUserPermissionScalarFieldEnum];

  export const CurrencyScalarFieldEnum: {
    CurrencyCode: 'CurrencyCode';
    CurrencyName: 'CurrencyName';
    CurrencySymbolUnicode: 'CurrencySymbolUnicode';
  };

  export type CurrencyScalarFieldEnum = (typeof CurrencyScalarFieldEnum)[keyof typeof CurrencyScalarFieldEnum];

  export const DBSettingScalarFieldEnum: {
    DBSettingId: 'DBSettingId';
    DBSettingName: 'DBSettingName';
    DBSettingValue: 'DBSettingValue';
  };

  export type DBSettingScalarFieldEnum = (typeof DBSettingScalarFieldEnum)[keyof typeof DBSettingScalarFieldEnum];

  export const FileScalarFieldEnum: {
    FileId: 'FileId';
    FileOriginalFilename: 'FileOriginalFilename';
    FileMediaType: 'FileMediaType';
    FileLocation: 'FileLocation';
    FileUploadDateTime: 'FileUploadDateTime';
    FileUploadUserId: 'FileUploadUserId';
    FileSizeBytes: 'FileSizeBytes';
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum];

  export const PermissionScalarFieldEnum: {
    PermissionId: 'PermissionId';
    PermissionParentPermissionId: 'PermissionParentPermissionId';
    PermissionName: 'PermissionName';
    PermissionDescription: 'PermissionDescription';
    PermissionSeqNo: 'PermissionSeqNo';
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum];

  export const ProductionCompanyScalarFieldEnum: {
    ProdCoId: 'ProdCoId';
    ProdCoAccountId: 'ProdCoAccountId';
    ProdCoName: 'ProdCoName';
    ProdCoWebSite: 'ProdCoWebSite';
    ProdCoSaleStartWeek: 'ProdCoSaleStartWeek';
    ProdCoVATCode: 'ProdCoVATCode';
    ProdCoLogoFileId: 'ProdCoLogoFileId';
  };

  export type ProductionCompanyScalarFieldEnum =
    (typeof ProductionCompanyScalarFieldEnum)[keyof typeof ProductionCompanyScalarFieldEnum];

  export const SubscriptionPlanScalarFieldEnum: {
    PlanId: 'PlanId';
    PlanName: 'PlanName';
    PlanDescription: 'PlanDescription';
    PlanPrice: 'PlanPrice';
    PlanFrequency: 'PlanFrequency';
    PlanPriceId: 'PlanPriceId';
    PlanCurrency: 'PlanCurrency';
  };

  export type SubscriptionPlanScalarFieldEnum =
    (typeof SubscriptionPlanScalarFieldEnum)[keyof typeof SubscriptionPlanScalarFieldEnum];

  export const UserScalarFieldEnum: {
    UserId: 'UserId';
    UserEmail: 'UserEmail';
    UserFirstName: 'UserFirstName';
    UserLastName: 'UserLastName';
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;

  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;

  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;

  /**
   * Deep Input Types
   */

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[];
    OR?: AccountWhereInput[];
    NOT?: AccountWhereInput | AccountWhereInput[];
    AccountId?: IntFilter<'Account'> | number;
    AccountName?: StringFilter<'Account'> | string;
    AccountAddress1?: StringNullableFilter<'Account'> | string | null;
    AccountAddress2?: StringNullableFilter<'Account'> | string | null;
    AccountAddress3?: StringNullableFilter<'Account'> | string | null;
    AccountAddressTown?: StringNullableFilter<'Account'> | string | null;
    AccountAddressCounty?: StringNullableFilter<'Account'> | string | null;
    AccountAddressPostcode?: StringNullableFilter<'Account'> | string | null;
    AccountAddressCountry?: StringNullableFilter<'Account'> | string | null;
    AccountVATNumber?: StringNullableFilter<'Account'> | string | null;
    AccountCurrencyCode?: StringFilter<'Account'> | string;
    AccountCompanyNumber?: StringNullableFilter<'Account'> | string | null;
    AccountLogoFileId?: IntNullableFilter<'Account'> | number | null;
    AccountMainEmail?: StringNullableFilter<'Account'> | string | null;
    AccountNumPeople?: IntNullableFilter<'Account'> | number | null;
    AccountOrganisationId?: StringNullableFilter<'Account'> | string | null;
    AccountTermsAgreedBy?: StringNullableFilter<'Account'> | string | null;
    AccountTermsAgreedDate?: DateTimeNullableFilter<'Account'> | Date | string | null;
    AccountWebsite?: StringNullableFilter<'Account'> | string | null;
    AccountTypeOfCompany?: StringNullableFilter<'Account'> | string | null;
    AccountPhone?: StringNullableFilter<'Account'> | string | null;
    AccountPaymentCurrencyCode?: StringNullableFilter<'Account'> | string | null;
    Currency?: XOR<CurrencyNullableRelationFilter, CurrencyWhereInput> | null;
    File?: XOR<FileNullableRelationFilter, FileWhereInput> | null;
    AccountContact?: AccountContactListRelationFilter;
    AccountSubscription?: AccountSubscriptionListRelationFilter;
    AccountUser?: AccountUserListRelationFilter;
    ProductionCompany?: ProductionCompanyListRelationFilter;
  };

  export type AccountOrderByWithRelationInput = {
    AccountId?: SortOrder;
    AccountName?: SortOrder;
    AccountAddress1?: SortOrderInput | SortOrder;
    AccountAddress2?: SortOrderInput | SortOrder;
    AccountAddress3?: SortOrderInput | SortOrder;
    AccountAddressTown?: SortOrderInput | SortOrder;
    AccountAddressCounty?: SortOrderInput | SortOrder;
    AccountAddressPostcode?: SortOrderInput | SortOrder;
    AccountAddressCountry?: SortOrderInput | SortOrder;
    AccountVATNumber?: SortOrderInput | SortOrder;
    AccountCurrencyCode?: SortOrder;
    AccountCompanyNumber?: SortOrderInput | SortOrder;
    AccountLogoFileId?: SortOrderInput | SortOrder;
    AccountMainEmail?: SortOrderInput | SortOrder;
    AccountNumPeople?: SortOrderInput | SortOrder;
    AccountOrganisationId?: SortOrderInput | SortOrder;
    AccountTermsAgreedBy?: SortOrderInput | SortOrder;
    AccountTermsAgreedDate?: SortOrderInput | SortOrder;
    AccountWebsite?: SortOrderInput | SortOrder;
    AccountTypeOfCompany?: SortOrderInput | SortOrder;
    AccountPhone?: SortOrderInput | SortOrder;
    AccountPaymentCurrencyCode?: SortOrderInput | SortOrder;
    Currency?: CurrencyOrderByWithRelationInput;
    File?: FileOrderByWithRelationInput;
    AccountContact?: AccountContactOrderByRelationAggregateInput;
    AccountSubscription?: AccountSubscriptionOrderByRelationAggregateInput;
    AccountUser?: AccountUserOrderByRelationAggregateInput;
    ProductionCompany?: ProductionCompanyOrderByRelationAggregateInput;
  };

  export type AccountWhereUniqueInput = Prisma.AtLeast<
    {
      AccountId?: number;
      AccountOrganisationId?: string;
      AND?: AccountWhereInput | AccountWhereInput[];
      OR?: AccountWhereInput[];
      NOT?: AccountWhereInput | AccountWhereInput[];
      AccountName?: StringFilter<'Account'> | string;
      AccountAddress1?: StringNullableFilter<'Account'> | string | null;
      AccountAddress2?: StringNullableFilter<'Account'> | string | null;
      AccountAddress3?: StringNullableFilter<'Account'> | string | null;
      AccountAddressTown?: StringNullableFilter<'Account'> | string | null;
      AccountAddressCounty?: StringNullableFilter<'Account'> | string | null;
      AccountAddressPostcode?: StringNullableFilter<'Account'> | string | null;
      AccountAddressCountry?: StringNullableFilter<'Account'> | string | null;
      AccountVATNumber?: StringNullableFilter<'Account'> | string | null;
      AccountCurrencyCode?: StringFilter<'Account'> | string;
      AccountCompanyNumber?: StringNullableFilter<'Account'> | string | null;
      AccountLogoFileId?: IntNullableFilter<'Account'> | number | null;
      AccountMainEmail?: StringNullableFilter<'Account'> | string | null;
      AccountNumPeople?: IntNullableFilter<'Account'> | number | null;
      AccountTermsAgreedBy?: StringNullableFilter<'Account'> | string | null;
      AccountTermsAgreedDate?: DateTimeNullableFilter<'Account'> | Date | string | null;
      AccountWebsite?: StringNullableFilter<'Account'> | string | null;
      AccountTypeOfCompany?: StringNullableFilter<'Account'> | string | null;
      AccountPhone?: StringNullableFilter<'Account'> | string | null;
      AccountPaymentCurrencyCode?: StringNullableFilter<'Account'> | string | null;
      Currency?: XOR<CurrencyNullableRelationFilter, CurrencyWhereInput> | null;
      File?: XOR<FileNullableRelationFilter, FileWhereInput> | null;
      AccountContact?: AccountContactListRelationFilter;
      AccountSubscription?: AccountSubscriptionListRelationFilter;
      AccountUser?: AccountUserListRelationFilter;
      ProductionCompany?: ProductionCompanyListRelationFilter;
    },
    'AccountId' | 'AccountOrganisationId'
  >;

  export type AccountOrderByWithAggregationInput = {
    AccountId?: SortOrder;
    AccountName?: SortOrder;
    AccountAddress1?: SortOrderInput | SortOrder;
    AccountAddress2?: SortOrderInput | SortOrder;
    AccountAddress3?: SortOrderInput | SortOrder;
    AccountAddressTown?: SortOrderInput | SortOrder;
    AccountAddressCounty?: SortOrderInput | SortOrder;
    AccountAddressPostcode?: SortOrderInput | SortOrder;
    AccountAddressCountry?: SortOrderInput | SortOrder;
    AccountVATNumber?: SortOrderInput | SortOrder;
    AccountCurrencyCode?: SortOrder;
    AccountCompanyNumber?: SortOrderInput | SortOrder;
    AccountLogoFileId?: SortOrderInput | SortOrder;
    AccountMainEmail?: SortOrderInput | SortOrder;
    AccountNumPeople?: SortOrderInput | SortOrder;
    AccountOrganisationId?: SortOrderInput | SortOrder;
    AccountTermsAgreedBy?: SortOrderInput | SortOrder;
    AccountTermsAgreedDate?: SortOrderInput | SortOrder;
    AccountWebsite?: SortOrderInput | SortOrder;
    AccountTypeOfCompany?: SortOrderInput | SortOrder;
    AccountPhone?: SortOrderInput | SortOrder;
    AccountPaymentCurrencyCode?: SortOrderInput | SortOrder;
    _count?: AccountCountOrderByAggregateInput;
    _avg?: AccountAvgOrderByAggregateInput;
    _max?: AccountMaxOrderByAggregateInput;
    _min?: AccountMinOrderByAggregateInput;
    _sum?: AccountSumOrderByAggregateInput;
  };

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[];
    OR?: AccountScalarWhereWithAggregatesInput[];
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[];
    AccountId?: IntWithAggregatesFilter<'Account'> | number;
    AccountName?: StringWithAggregatesFilter<'Account'> | string;
    AccountAddress1?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountAddress2?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountAddress3?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountAddressTown?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountAddressCounty?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountAddressPostcode?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountAddressCountry?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountVATNumber?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountCurrencyCode?: StringWithAggregatesFilter<'Account'> | string;
    AccountCompanyNumber?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountLogoFileId?: IntNullableWithAggregatesFilter<'Account'> | number | null;
    AccountMainEmail?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountNumPeople?: IntNullableWithAggregatesFilter<'Account'> | number | null;
    AccountOrganisationId?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountTermsAgreedBy?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountTermsAgreedDate?: DateTimeNullableWithAggregatesFilter<'Account'> | Date | string | null;
    AccountWebsite?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountTypeOfCompany?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountPhone?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    AccountPaymentCurrencyCode?: StringNullableWithAggregatesFilter<'Account'> | string | null;
  };

  export type AccountContactWhereInput = {
    AND?: AccountContactWhereInput | AccountContactWhereInput[];
    OR?: AccountContactWhereInput[];
    NOT?: AccountContactWhereInput | AccountContactWhereInput[];
    AccContId?: IntFilter<'AccountContact'> | number;
    AccContAccountId?: IntFilter<'AccountContact'> | number;
    AccContFirstName?: StringFilter<'AccountContact'> | string;
    AccContLastName?: StringNullableFilter<'AccountContact'> | string | null;
    AccContPhone?: StringNullableFilter<'AccountContact'> | string | null;
    AccContMainEmail?: StringNullableFilter<'AccountContact'> | string | null;
    Account?: XOR<AccountRelationFilter, AccountWhereInput>;
  };

  export type AccountContactOrderByWithRelationInput = {
    AccContId?: SortOrder;
    AccContAccountId?: SortOrder;
    AccContFirstName?: SortOrder;
    AccContLastName?: SortOrderInput | SortOrder;
    AccContPhone?: SortOrderInput | SortOrder;
    AccContMainEmail?: SortOrderInput | SortOrder;
    Account?: AccountOrderByWithRelationInput;
  };

  export type AccountContactWhereUniqueInput = Prisma.AtLeast<
    {
      AccContId?: number;
      AND?: AccountContactWhereInput | AccountContactWhereInput[];
      OR?: AccountContactWhereInput[];
      NOT?: AccountContactWhereInput | AccountContactWhereInput[];
      AccContAccountId?: IntFilter<'AccountContact'> | number;
      AccContFirstName?: StringFilter<'AccountContact'> | string;
      AccContLastName?: StringNullableFilter<'AccountContact'> | string | null;
      AccContPhone?: StringNullableFilter<'AccountContact'> | string | null;
      AccContMainEmail?: StringNullableFilter<'AccountContact'> | string | null;
      Account?: XOR<AccountRelationFilter, AccountWhereInput>;
    },
    'AccContId'
  >;

  export type AccountContactOrderByWithAggregationInput = {
    AccContId?: SortOrder;
    AccContAccountId?: SortOrder;
    AccContFirstName?: SortOrder;
    AccContLastName?: SortOrderInput | SortOrder;
    AccContPhone?: SortOrderInput | SortOrder;
    AccContMainEmail?: SortOrderInput | SortOrder;
    _count?: AccountContactCountOrderByAggregateInput;
    _avg?: AccountContactAvgOrderByAggregateInput;
    _max?: AccountContactMaxOrderByAggregateInput;
    _min?: AccountContactMinOrderByAggregateInput;
    _sum?: AccountContactSumOrderByAggregateInput;
  };

  export type AccountContactScalarWhereWithAggregatesInput = {
    AND?: AccountContactScalarWhereWithAggregatesInput | AccountContactScalarWhereWithAggregatesInput[];
    OR?: AccountContactScalarWhereWithAggregatesInput[];
    NOT?: AccountContactScalarWhereWithAggregatesInput | AccountContactScalarWhereWithAggregatesInput[];
    AccContId?: IntWithAggregatesFilter<'AccountContact'> | number;
    AccContAccountId?: IntWithAggregatesFilter<'AccountContact'> | number;
    AccContFirstName?: StringWithAggregatesFilter<'AccountContact'> | string;
    AccContLastName?: StringNullableWithAggregatesFilter<'AccountContact'> | string | null;
    AccContPhone?: StringNullableWithAggregatesFilter<'AccountContact'> | string | null;
    AccContMainEmail?: StringNullableWithAggregatesFilter<'AccountContact'> | string | null;
  };

  export type AccountSubscriptionWhereInput = {
    AND?: AccountSubscriptionWhereInput | AccountSubscriptionWhereInput[];
    OR?: AccountSubscriptionWhereInput[];
    NOT?: AccountSubscriptionWhereInput | AccountSubscriptionWhereInput[];
    AccSubId?: IntFilter<'AccountSubscription'> | number;
    AccSubAccountId?: IntFilter<'AccountSubscription'> | number;
    AccSubPlanId?: IntFilter<'AccountSubscription'> | number;
    AccSubStartDate?: DateTimeFilter<'AccountSubscription'> | Date | string;
    AccSubEndDate?: DateTimeNullableFilter<'AccountSubscription'> | Date | string | null;
    AccSubIsActive?: BoolNullableFilter<'AccountSubscription'> | boolean | null;
    Account?: XOR<AccountRelationFilter, AccountWhereInput>;
    SubscriptionPlan?: XOR<SubscriptionPlanRelationFilter, SubscriptionPlanWhereInput>;
  };

  export type AccountSubscriptionOrderByWithRelationInput = {
    AccSubId?: SortOrder;
    AccSubAccountId?: SortOrder;
    AccSubPlanId?: SortOrder;
    AccSubStartDate?: SortOrder;
    AccSubEndDate?: SortOrderInput | SortOrder;
    AccSubIsActive?: SortOrderInput | SortOrder;
    Account?: AccountOrderByWithRelationInput;
    SubscriptionPlan?: SubscriptionPlanOrderByWithRelationInput;
  };

  export type AccountSubscriptionWhereUniqueInput = Prisma.AtLeast<
    {
      AccSubId?: number;
      AND?: AccountSubscriptionWhereInput | AccountSubscriptionWhereInput[];
      OR?: AccountSubscriptionWhereInput[];
      NOT?: AccountSubscriptionWhereInput | AccountSubscriptionWhereInput[];
      AccSubAccountId?: IntFilter<'AccountSubscription'> | number;
      AccSubPlanId?: IntFilter<'AccountSubscription'> | number;
      AccSubStartDate?: DateTimeFilter<'AccountSubscription'> | Date | string;
      AccSubEndDate?: DateTimeNullableFilter<'AccountSubscription'> | Date | string | null;
      AccSubIsActive?: BoolNullableFilter<'AccountSubscription'> | boolean | null;
      Account?: XOR<AccountRelationFilter, AccountWhereInput>;
      SubscriptionPlan?: XOR<SubscriptionPlanRelationFilter, SubscriptionPlanWhereInput>;
    },
    'AccSubId'
  >;

  export type AccountSubscriptionOrderByWithAggregationInput = {
    AccSubId?: SortOrder;
    AccSubAccountId?: SortOrder;
    AccSubPlanId?: SortOrder;
    AccSubStartDate?: SortOrder;
    AccSubEndDate?: SortOrderInput | SortOrder;
    AccSubIsActive?: SortOrderInput | SortOrder;
    _count?: AccountSubscriptionCountOrderByAggregateInput;
    _avg?: AccountSubscriptionAvgOrderByAggregateInput;
    _max?: AccountSubscriptionMaxOrderByAggregateInput;
    _min?: AccountSubscriptionMinOrderByAggregateInput;
    _sum?: AccountSubscriptionSumOrderByAggregateInput;
  };

  export type AccountSubscriptionScalarWhereWithAggregatesInput = {
    AND?: AccountSubscriptionScalarWhereWithAggregatesInput | AccountSubscriptionScalarWhereWithAggregatesInput[];
    OR?: AccountSubscriptionScalarWhereWithAggregatesInput[];
    NOT?: AccountSubscriptionScalarWhereWithAggregatesInput | AccountSubscriptionScalarWhereWithAggregatesInput[];
    AccSubId?: IntWithAggregatesFilter<'AccountSubscription'> | number;
    AccSubAccountId?: IntWithAggregatesFilter<'AccountSubscription'> | number;
    AccSubPlanId?: IntWithAggregatesFilter<'AccountSubscription'> | number;
    AccSubStartDate?: DateTimeWithAggregatesFilter<'AccountSubscription'> | Date | string;
    AccSubEndDate?: DateTimeNullableWithAggregatesFilter<'AccountSubscription'> | Date | string | null;
    AccSubIsActive?: BoolNullableWithAggregatesFilter<'AccountSubscription'> | boolean | null;
  };

  export type AccountUserWhereInput = {
    AND?: AccountUserWhereInput | AccountUserWhereInput[];
    OR?: AccountUserWhereInput[];
    NOT?: AccountUserWhereInput | AccountUserWhereInput[];
    AccUserId?: IntFilter<'AccountUser'> | number;
    AccUserUserId?: IntFilter<'AccountUser'> | number;
    AccUserAccountId?: IntFilter<'AccountUser'> | number;
    AccUserIsAdmin?: BoolFilter<'AccountUser'> | boolean;
    AccUserPIN?: StringNullableFilter<'AccountUser'> | string | null;
    Account?: XOR<AccountRelationFilter, AccountWhereInput>;
    User?: XOR<UserRelationFilter, UserWhereInput>;
    AccountUserPermission?: AccountUserPermissionListRelationFilter;
  };

  export type AccountUserOrderByWithRelationInput = {
    AccUserId?: SortOrder;
    AccUserUserId?: SortOrder;
    AccUserAccountId?: SortOrder;
    AccUserIsAdmin?: SortOrder;
    AccUserPIN?: SortOrderInput | SortOrder;
    Account?: AccountOrderByWithRelationInput;
    User?: UserOrderByWithRelationInput;
    AccountUserPermission?: AccountUserPermissionOrderByRelationAggregateInput;
  };

  export type AccountUserWhereUniqueInput = Prisma.AtLeast<
    {
      AccUserId?: number;
      AccUserUserId?: number;
      AND?: AccountUserWhereInput | AccountUserWhereInput[];
      OR?: AccountUserWhereInput[];
      NOT?: AccountUserWhereInput | AccountUserWhereInput[];
      AccUserAccountId?: IntFilter<'AccountUser'> | number;
      AccUserIsAdmin?: BoolFilter<'AccountUser'> | boolean;
      AccUserPIN?: StringNullableFilter<'AccountUser'> | string | null;
      Account?: XOR<AccountRelationFilter, AccountWhereInput>;
      User?: XOR<UserRelationFilter, UserWhereInput>;
      AccountUserPermission?: AccountUserPermissionListRelationFilter;
    },
    'AccUserId' | 'AccUserUserId'
  >;

  export type AccountUserOrderByWithAggregationInput = {
    AccUserId?: SortOrder;
    AccUserUserId?: SortOrder;
    AccUserAccountId?: SortOrder;
    AccUserIsAdmin?: SortOrder;
    AccUserPIN?: SortOrderInput | SortOrder;
    _count?: AccountUserCountOrderByAggregateInput;
    _avg?: AccountUserAvgOrderByAggregateInput;
    _max?: AccountUserMaxOrderByAggregateInput;
    _min?: AccountUserMinOrderByAggregateInput;
    _sum?: AccountUserSumOrderByAggregateInput;
  };

  export type AccountUserScalarWhereWithAggregatesInput = {
    AND?: AccountUserScalarWhereWithAggregatesInput | AccountUserScalarWhereWithAggregatesInput[];
    OR?: AccountUserScalarWhereWithAggregatesInput[];
    NOT?: AccountUserScalarWhereWithAggregatesInput | AccountUserScalarWhereWithAggregatesInput[];
    AccUserId?: IntWithAggregatesFilter<'AccountUser'> | number;
    AccUserUserId?: IntWithAggregatesFilter<'AccountUser'> | number;
    AccUserAccountId?: IntWithAggregatesFilter<'AccountUser'> | number;
    AccUserIsAdmin?: BoolWithAggregatesFilter<'AccountUser'> | boolean;
    AccUserPIN?: StringNullableWithAggregatesFilter<'AccountUser'> | string | null;
  };

  export type AccountUserPermissionWhereInput = {
    AND?: AccountUserPermissionWhereInput | AccountUserPermissionWhereInput[];
    OR?: AccountUserPermissionWhereInput[];
    NOT?: AccountUserPermissionWhereInput | AccountUserPermissionWhereInput[];
    UserAuthId?: IntFilter<'AccountUserPermission'> | number;
    UserAuthAccUserId?: IntFilter<'AccountUserPermission'> | number;
    UserAuthPermissionId?: IntFilter<'AccountUserPermission'> | number;
    AccountUser?: XOR<AccountUserRelationFilter, AccountUserWhereInput>;
    Permission?: XOR<PermissionRelationFilter, PermissionWhereInput>;
  };

  export type AccountUserPermissionOrderByWithRelationInput = {
    UserAuthId?: SortOrder;
    UserAuthAccUserId?: SortOrder;
    UserAuthPermissionId?: SortOrder;
    AccountUser?: AccountUserOrderByWithRelationInput;
    Permission?: PermissionOrderByWithRelationInput;
  };

  export type AccountUserPermissionWhereUniqueInput = Prisma.AtLeast<
    {
      UserAuthId?: number;
      AND?: AccountUserPermissionWhereInput | AccountUserPermissionWhereInput[];
      OR?: AccountUserPermissionWhereInput[];
      NOT?: AccountUserPermissionWhereInput | AccountUserPermissionWhereInput[];
      UserAuthAccUserId?: IntFilter<'AccountUserPermission'> | number;
      UserAuthPermissionId?: IntFilter<'AccountUserPermission'> | number;
      AccountUser?: XOR<AccountUserRelationFilter, AccountUserWhereInput>;
      Permission?: XOR<PermissionRelationFilter, PermissionWhereInput>;
    },
    'UserAuthId'
  >;

  export type AccountUserPermissionOrderByWithAggregationInput = {
    UserAuthId?: SortOrder;
    UserAuthAccUserId?: SortOrder;
    UserAuthPermissionId?: SortOrder;
    _count?: AccountUserPermissionCountOrderByAggregateInput;
    _avg?: AccountUserPermissionAvgOrderByAggregateInput;
    _max?: AccountUserPermissionMaxOrderByAggregateInput;
    _min?: AccountUserPermissionMinOrderByAggregateInput;
    _sum?: AccountUserPermissionSumOrderByAggregateInput;
  };

  export type AccountUserPermissionScalarWhereWithAggregatesInput = {
    AND?: AccountUserPermissionScalarWhereWithAggregatesInput | AccountUserPermissionScalarWhereWithAggregatesInput[];
    OR?: AccountUserPermissionScalarWhereWithAggregatesInput[];
    NOT?: AccountUserPermissionScalarWhereWithAggregatesInput | AccountUserPermissionScalarWhereWithAggregatesInput[];
    UserAuthId?: IntWithAggregatesFilter<'AccountUserPermission'> | number;
    UserAuthAccUserId?: IntWithAggregatesFilter<'AccountUserPermission'> | number;
    UserAuthPermissionId?: IntWithAggregatesFilter<'AccountUserPermission'> | number;
  };

  export type CurrencyWhereInput = {
    AND?: CurrencyWhereInput | CurrencyWhereInput[];
    OR?: CurrencyWhereInput[];
    NOT?: CurrencyWhereInput | CurrencyWhereInput[];
    CurrencyCode?: StringFilter<'Currency'> | string;
    CurrencyName?: StringFilter<'Currency'> | string;
    CurrencySymbolUnicode?: StringNullableFilter<'Currency'> | string | null;
    Account?: AccountListRelationFilter;
  };

  export type CurrencyOrderByWithRelationInput = {
    CurrencyCode?: SortOrder;
    CurrencyName?: SortOrder;
    CurrencySymbolUnicode?: SortOrderInput | SortOrder;
    Account?: AccountOrderByRelationAggregateInput;
  };

  export type CurrencyWhereUniqueInput = Prisma.AtLeast<
    {
      CurrencyCode?: string;
      AND?: CurrencyWhereInput | CurrencyWhereInput[];
      OR?: CurrencyWhereInput[];
      NOT?: CurrencyWhereInput | CurrencyWhereInput[];
      CurrencyName?: StringFilter<'Currency'> | string;
      CurrencySymbolUnicode?: StringNullableFilter<'Currency'> | string | null;
      Account?: AccountListRelationFilter;
    },
    'CurrencyCode'
  >;

  export type CurrencyOrderByWithAggregationInput = {
    CurrencyCode?: SortOrder;
    CurrencyName?: SortOrder;
    CurrencySymbolUnicode?: SortOrderInput | SortOrder;
    _count?: CurrencyCountOrderByAggregateInput;
    _max?: CurrencyMaxOrderByAggregateInput;
    _min?: CurrencyMinOrderByAggregateInput;
  };

  export type CurrencyScalarWhereWithAggregatesInput = {
    AND?: CurrencyScalarWhereWithAggregatesInput | CurrencyScalarWhereWithAggregatesInput[];
    OR?: CurrencyScalarWhereWithAggregatesInput[];
    NOT?: CurrencyScalarWhereWithAggregatesInput | CurrencyScalarWhereWithAggregatesInput[];
    CurrencyCode?: StringWithAggregatesFilter<'Currency'> | string;
    CurrencyName?: StringWithAggregatesFilter<'Currency'> | string;
    CurrencySymbolUnicode?: StringNullableWithAggregatesFilter<'Currency'> | string | null;
  };

  export type DBSettingWhereInput = {
    AND?: DBSettingWhereInput | DBSettingWhereInput[];
    OR?: DBSettingWhereInput[];
    NOT?: DBSettingWhereInput | DBSettingWhereInput[];
    DBSettingId?: IntFilter<'DBSetting'> | number;
    DBSettingName?: StringFilter<'DBSetting'> | string;
    DBSettingValue?: StringFilter<'DBSetting'> | string;
  };

  export type DBSettingOrderByWithRelationInput = {
    DBSettingId?: SortOrder;
    DBSettingName?: SortOrder;
    DBSettingValue?: SortOrder;
  };

  export type DBSettingWhereUniqueInput = Prisma.AtLeast<
    {
      DBSettingId?: number;
      DBSettingName?: string;
      AND?: DBSettingWhereInput | DBSettingWhereInput[];
      OR?: DBSettingWhereInput[];
      NOT?: DBSettingWhereInput | DBSettingWhereInput[];
      DBSettingValue?: StringFilter<'DBSetting'> | string;
    },
    'DBSettingId' | 'DBSettingName'
  >;

  export type DBSettingOrderByWithAggregationInput = {
    DBSettingId?: SortOrder;
    DBSettingName?: SortOrder;
    DBSettingValue?: SortOrder;
    _count?: DBSettingCountOrderByAggregateInput;
    _avg?: DBSettingAvgOrderByAggregateInput;
    _max?: DBSettingMaxOrderByAggregateInput;
    _min?: DBSettingMinOrderByAggregateInput;
    _sum?: DBSettingSumOrderByAggregateInput;
  };

  export type DBSettingScalarWhereWithAggregatesInput = {
    AND?: DBSettingScalarWhereWithAggregatesInput | DBSettingScalarWhereWithAggregatesInput[];
    OR?: DBSettingScalarWhereWithAggregatesInput[];
    NOT?: DBSettingScalarWhereWithAggregatesInput | DBSettingScalarWhereWithAggregatesInput[];
    DBSettingId?: IntWithAggregatesFilter<'DBSetting'> | number;
    DBSettingName?: StringWithAggregatesFilter<'DBSetting'> | string;
    DBSettingValue?: StringWithAggregatesFilter<'DBSetting'> | string;
  };

  export type FileWhereInput = {
    AND?: FileWhereInput | FileWhereInput[];
    OR?: FileWhereInput[];
    NOT?: FileWhereInput | FileWhereInput[];
    FileId?: IntFilter<'File'> | number;
    FileOriginalFilename?: StringFilter<'File'> | string;
    FileMediaType?: StringNullableFilter<'File'> | string | null;
    FileLocation?: StringFilter<'File'> | string;
    FileUploadDateTime?: DateTimeFilter<'File'> | Date | string;
    FileUploadUserId?: IntFilter<'File'> | number;
    FileSizeBytes?: BigIntNullableFilter<'File'> | bigint | number | null;
    Account?: AccountListRelationFilter;
    User?: XOR<UserRelationFilter, UserWhereInput>;
    ProductionCompany?: ProductionCompanyListRelationFilter;
  };

  export type FileOrderByWithRelationInput = {
    FileId?: SortOrder;
    FileOriginalFilename?: SortOrder;
    FileMediaType?: SortOrderInput | SortOrder;
    FileLocation?: SortOrder;
    FileUploadDateTime?: SortOrder;
    FileUploadUserId?: SortOrder;
    FileSizeBytes?: SortOrderInput | SortOrder;
    Account?: AccountOrderByRelationAggregateInput;
    User?: UserOrderByWithRelationInput;
    ProductionCompany?: ProductionCompanyOrderByRelationAggregateInput;
  };

  export type FileWhereUniqueInput = Prisma.AtLeast<
    {
      FileId?: number;
      AND?: FileWhereInput | FileWhereInput[];
      OR?: FileWhereInput[];
      NOT?: FileWhereInput | FileWhereInput[];
      FileOriginalFilename?: StringFilter<'File'> | string;
      FileMediaType?: StringNullableFilter<'File'> | string | null;
      FileLocation?: StringFilter<'File'> | string;
      FileUploadDateTime?: DateTimeFilter<'File'> | Date | string;
      FileUploadUserId?: IntFilter<'File'> | number;
      FileSizeBytes?: BigIntNullableFilter<'File'> | bigint | number | null;
      Account?: AccountListRelationFilter;
      User?: XOR<UserRelationFilter, UserWhereInput>;
      ProductionCompany?: ProductionCompanyListRelationFilter;
    },
    'FileId'
  >;

  export type FileOrderByWithAggregationInput = {
    FileId?: SortOrder;
    FileOriginalFilename?: SortOrder;
    FileMediaType?: SortOrderInput | SortOrder;
    FileLocation?: SortOrder;
    FileUploadDateTime?: SortOrder;
    FileUploadUserId?: SortOrder;
    FileSizeBytes?: SortOrderInput | SortOrder;
    _count?: FileCountOrderByAggregateInput;
    _avg?: FileAvgOrderByAggregateInput;
    _max?: FileMaxOrderByAggregateInput;
    _min?: FileMinOrderByAggregateInput;
    _sum?: FileSumOrderByAggregateInput;
  };

  export type FileScalarWhereWithAggregatesInput = {
    AND?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[];
    OR?: FileScalarWhereWithAggregatesInput[];
    NOT?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[];
    FileId?: IntWithAggregatesFilter<'File'> | number;
    FileOriginalFilename?: StringWithAggregatesFilter<'File'> | string;
    FileMediaType?: StringNullableWithAggregatesFilter<'File'> | string | null;
    FileLocation?: StringWithAggregatesFilter<'File'> | string;
    FileUploadDateTime?: DateTimeWithAggregatesFilter<'File'> | Date | string;
    FileUploadUserId?: IntWithAggregatesFilter<'File'> | number;
    FileSizeBytes?: BigIntNullableWithAggregatesFilter<'File'> | bigint | number | null;
  };

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[];
    OR?: PermissionWhereInput[];
    NOT?: PermissionWhereInput | PermissionWhereInput[];
    PermissionId?: IntFilter<'Permission'> | number;
    PermissionParentPermissionId?: IntNullableFilter<'Permission'> | number | null;
    PermissionName?: StringFilter<'Permission'> | string;
    PermissionDescription?: StringFilter<'Permission'> | string;
    PermissionSeqNo?: IntNullableFilter<'Permission'> | number | null;
    AccountUserPermission?: AccountUserPermissionListRelationFilter;
  };

  export type PermissionOrderByWithRelationInput = {
    PermissionId?: SortOrder;
    PermissionParentPermissionId?: SortOrderInput | SortOrder;
    PermissionName?: SortOrder;
    PermissionDescription?: SortOrder;
    PermissionSeqNo?: SortOrderInput | SortOrder;
    AccountUserPermission?: AccountUserPermissionOrderByRelationAggregateInput;
  };

  export type PermissionWhereUniqueInput = Prisma.AtLeast<
    {
      PermissionId?: number;
      AND?: PermissionWhereInput | PermissionWhereInput[];
      OR?: PermissionWhereInput[];
      NOT?: PermissionWhereInput | PermissionWhereInput[];
      PermissionParentPermissionId?: IntNullableFilter<'Permission'> | number | null;
      PermissionName?: StringFilter<'Permission'> | string;
      PermissionDescription?: StringFilter<'Permission'> | string;
      PermissionSeqNo?: IntNullableFilter<'Permission'> | number | null;
      AccountUserPermission?: AccountUserPermissionListRelationFilter;
    },
    'PermissionId'
  >;

  export type PermissionOrderByWithAggregationInput = {
    PermissionId?: SortOrder;
    PermissionParentPermissionId?: SortOrderInput | SortOrder;
    PermissionName?: SortOrder;
    PermissionDescription?: SortOrder;
    PermissionSeqNo?: SortOrderInput | SortOrder;
    _count?: PermissionCountOrderByAggregateInput;
    _avg?: PermissionAvgOrderByAggregateInput;
    _max?: PermissionMaxOrderByAggregateInput;
    _min?: PermissionMinOrderByAggregateInput;
    _sum?: PermissionSumOrderByAggregateInput;
  };

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[];
    OR?: PermissionScalarWhereWithAggregatesInput[];
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[];
    PermissionId?: IntWithAggregatesFilter<'Permission'> | number;
    PermissionParentPermissionId?: IntNullableWithAggregatesFilter<'Permission'> | number | null;
    PermissionName?: StringWithAggregatesFilter<'Permission'> | string;
    PermissionDescription?: StringWithAggregatesFilter<'Permission'> | string;
    PermissionSeqNo?: IntNullableWithAggregatesFilter<'Permission'> | number | null;
  };

  export type ProductionCompanyWhereInput = {
    AND?: ProductionCompanyWhereInput | ProductionCompanyWhereInput[];
    OR?: ProductionCompanyWhereInput[];
    NOT?: ProductionCompanyWhereInput | ProductionCompanyWhereInput[];
    ProdCoId?: IntFilter<'ProductionCompany'> | number;
    ProdCoAccountId?: IntFilter<'ProductionCompany'> | number;
    ProdCoName?: StringFilter<'ProductionCompany'> | string;
    ProdCoWebSite?: StringNullableFilter<'ProductionCompany'> | string | null;
    ProdCoSaleStartWeek?: IntNullableFilter<'ProductionCompany'> | number | null;
    ProdCoVATCode?: StringNullableFilter<'ProductionCompany'> | string | null;
    ProdCoLogoFileId?: IntNullableFilter<'ProductionCompany'> | number | null;
    Account?: XOR<AccountRelationFilter, AccountWhereInput>;
    File?: XOR<FileNullableRelationFilter, FileWhereInput> | null;
  };

  export type ProductionCompanyOrderByWithRelationInput = {
    ProdCoId?: SortOrder;
    ProdCoAccountId?: SortOrder;
    ProdCoName?: SortOrder;
    ProdCoWebSite?: SortOrderInput | SortOrder;
    ProdCoSaleStartWeek?: SortOrderInput | SortOrder;
    ProdCoVATCode?: SortOrderInput | SortOrder;
    ProdCoLogoFileId?: SortOrderInput | SortOrder;
    Account?: AccountOrderByWithRelationInput;
    File?: FileOrderByWithRelationInput;
  };

  export type ProductionCompanyWhereUniqueInput = Prisma.AtLeast<
    {
      ProdCoId?: number;
      AND?: ProductionCompanyWhereInput | ProductionCompanyWhereInput[];
      OR?: ProductionCompanyWhereInput[];
      NOT?: ProductionCompanyWhereInput | ProductionCompanyWhereInput[];
      ProdCoAccountId?: IntFilter<'ProductionCompany'> | number;
      ProdCoName?: StringFilter<'ProductionCompany'> | string;
      ProdCoWebSite?: StringNullableFilter<'ProductionCompany'> | string | null;
      ProdCoSaleStartWeek?: IntNullableFilter<'ProductionCompany'> | number | null;
      ProdCoVATCode?: StringNullableFilter<'ProductionCompany'> | string | null;
      ProdCoLogoFileId?: IntNullableFilter<'ProductionCompany'> | number | null;
      Account?: XOR<AccountRelationFilter, AccountWhereInput>;
      File?: XOR<FileNullableRelationFilter, FileWhereInput> | null;
    },
    'ProdCoId'
  >;

  export type ProductionCompanyOrderByWithAggregationInput = {
    ProdCoId?: SortOrder;
    ProdCoAccountId?: SortOrder;
    ProdCoName?: SortOrder;
    ProdCoWebSite?: SortOrderInput | SortOrder;
    ProdCoSaleStartWeek?: SortOrderInput | SortOrder;
    ProdCoVATCode?: SortOrderInput | SortOrder;
    ProdCoLogoFileId?: SortOrderInput | SortOrder;
    _count?: ProductionCompanyCountOrderByAggregateInput;
    _avg?: ProductionCompanyAvgOrderByAggregateInput;
    _max?: ProductionCompanyMaxOrderByAggregateInput;
    _min?: ProductionCompanyMinOrderByAggregateInput;
    _sum?: ProductionCompanySumOrderByAggregateInput;
  };

  export type ProductionCompanyScalarWhereWithAggregatesInput = {
    AND?: ProductionCompanyScalarWhereWithAggregatesInput | ProductionCompanyScalarWhereWithAggregatesInput[];
    OR?: ProductionCompanyScalarWhereWithAggregatesInput[];
    NOT?: ProductionCompanyScalarWhereWithAggregatesInput | ProductionCompanyScalarWhereWithAggregatesInput[];
    ProdCoId?: IntWithAggregatesFilter<'ProductionCompany'> | number;
    ProdCoAccountId?: IntWithAggregatesFilter<'ProductionCompany'> | number;
    ProdCoName?: StringWithAggregatesFilter<'ProductionCompany'> | string;
    ProdCoWebSite?: StringNullableWithAggregatesFilter<'ProductionCompany'> | string | null;
    ProdCoSaleStartWeek?: IntNullableWithAggregatesFilter<'ProductionCompany'> | number | null;
    ProdCoVATCode?: StringNullableWithAggregatesFilter<'ProductionCompany'> | string | null;
    ProdCoLogoFileId?: IntNullableWithAggregatesFilter<'ProductionCompany'> | number | null;
  };

  export type SubscriptionPlanWhereInput = {
    AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[];
    OR?: SubscriptionPlanWhereInput[];
    NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[];
    PlanId?: IntFilter<'SubscriptionPlan'> | number;
    PlanName?: StringFilter<'SubscriptionPlan'> | string;
    PlanDescription?: StringNullableFilter<'SubscriptionPlan'> | string | null;
    PlanPrice?: DecimalFilter<'SubscriptionPlan'> | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntFilter<'SubscriptionPlan'> | number;
    PlanPriceId?: StringNullableFilter<'SubscriptionPlan'> | string | null;
    PlanCurrency?: StringFilter<'SubscriptionPlan'> | string;
    AccountSubscription?: AccountSubscriptionListRelationFilter;
  };

  export type SubscriptionPlanOrderByWithRelationInput = {
    PlanId?: SortOrder;
    PlanName?: SortOrder;
    PlanDescription?: SortOrderInput | SortOrder;
    PlanPrice?: SortOrder;
    PlanFrequency?: SortOrder;
    PlanPriceId?: SortOrderInput | SortOrder;
    PlanCurrency?: SortOrder;
    AccountSubscription?: AccountSubscriptionOrderByRelationAggregateInput;
  };

  export type SubscriptionPlanWhereUniqueInput = Prisma.AtLeast<
    {
      PlanId?: number;
      AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[];
      OR?: SubscriptionPlanWhereInput[];
      NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[];
      PlanName?: StringFilter<'SubscriptionPlan'> | string;
      PlanDescription?: StringNullableFilter<'SubscriptionPlan'> | string | null;
      PlanPrice?: DecimalFilter<'SubscriptionPlan'> | Decimal | DecimalJsLike | number | string;
      PlanFrequency?: IntFilter<'SubscriptionPlan'> | number;
      PlanPriceId?: StringNullableFilter<'SubscriptionPlan'> | string | null;
      PlanCurrency?: StringFilter<'SubscriptionPlan'> | string;
      AccountSubscription?: AccountSubscriptionListRelationFilter;
    },
    'PlanId'
  >;

  export type SubscriptionPlanOrderByWithAggregationInput = {
    PlanId?: SortOrder;
    PlanName?: SortOrder;
    PlanDescription?: SortOrderInput | SortOrder;
    PlanPrice?: SortOrder;
    PlanFrequency?: SortOrder;
    PlanPriceId?: SortOrderInput | SortOrder;
    PlanCurrency?: SortOrder;
    _count?: SubscriptionPlanCountOrderByAggregateInput;
    _avg?: SubscriptionPlanAvgOrderByAggregateInput;
    _max?: SubscriptionPlanMaxOrderByAggregateInput;
    _min?: SubscriptionPlanMinOrderByAggregateInput;
    _sum?: SubscriptionPlanSumOrderByAggregateInput;
  };

  export type SubscriptionPlanScalarWhereWithAggregatesInput = {
    AND?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[];
    OR?: SubscriptionPlanScalarWhereWithAggregatesInput[];
    NOT?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[];
    PlanId?: IntWithAggregatesFilter<'SubscriptionPlan'> | number;
    PlanName?: StringWithAggregatesFilter<'SubscriptionPlan'> | string;
    PlanDescription?: StringNullableWithAggregatesFilter<'SubscriptionPlan'> | string | null;
    PlanPrice?: DecimalWithAggregatesFilter<'SubscriptionPlan'> | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntWithAggregatesFilter<'SubscriptionPlan'> | number;
    PlanPriceId?: StringNullableWithAggregatesFilter<'SubscriptionPlan'> | string | null;
    PlanCurrency?: StringWithAggregatesFilter<'SubscriptionPlan'> | string;
  };

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    UserId?: IntFilter<'User'> | number;
    UserEmail?: StringFilter<'User'> | string;
    UserFirstName?: StringFilter<'User'> | string;
    UserLastName?: StringNullableFilter<'User'> | string | null;
    AccountUser?: XOR<AccountUserNullableRelationFilter, AccountUserWhereInput> | null;
    File?: FileListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    UserId?: SortOrder;
    UserEmail?: SortOrder;
    UserFirstName?: SortOrder;
    UserLastName?: SortOrderInput | SortOrder;
    AccountUser?: AccountUserOrderByWithRelationInput;
    File?: FileOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      UserId?: number;
      UserEmail?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      UserFirstName?: StringFilter<'User'> | string;
      UserLastName?: StringNullableFilter<'User'> | string | null;
      AccountUser?: XOR<AccountUserNullableRelationFilter, AccountUserWhereInput> | null;
      File?: FileListRelationFilter;
    },
    'UserId' | 'UserId' | 'UserEmail'
  >;

  export type UserOrderByWithAggregationInput = {
    UserId?: SortOrder;
    UserEmail?: SortOrder;
    UserFirstName?: SortOrder;
    UserLastName?: SortOrderInput | SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _avg?: UserAvgOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
    _sum?: UserSumOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    UserId?: IntWithAggregatesFilter<'User'> | number;
    UserEmail?: StringWithAggregatesFilter<'User'> | string;
    UserFirstName?: StringWithAggregatesFilter<'User'> | string;
    UserLastName?: StringNullableWithAggregatesFilter<'User'> | string | null;
  };

  export type AccountCreateInput = {
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    Currency?: CurrencyCreateNestedOneWithoutAccountInput;
    File?: FileCreateNestedOneWithoutAccountInput;
    AccountContact?: AccountContactCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutAccountInput;
  };

  export type AccountUncheckedCreateInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
    AccountContact?: AccountContactUncheckedCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionUncheckedCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserUncheckedCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type AccountUpdateInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    Currency?: CurrencyUpdateOneWithoutAccountNestedInput;
    File?: FileUpdateOneWithoutAccountNestedInput;
    AccountContact?: AccountContactUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountContact?: AccountContactUncheckedUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUncheckedUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUncheckedUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type AccountCreateManyInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
  };

  export type AccountUpdateManyMutationInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountUncheckedUpdateManyInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountContactCreateInput = {
    AccContFirstName: string;
    AccContLastName?: string | null;
    AccContPhone?: string | null;
    AccContMainEmail?: string | null;
    Account: AccountCreateNestedOneWithoutAccountContactInput;
  };

  export type AccountContactUncheckedCreateInput = {
    AccContId?: number;
    AccContAccountId: number;
    AccContFirstName: string;
    AccContLastName?: string | null;
    AccContPhone?: string | null;
    AccContMainEmail?: string | null;
  };

  export type AccountContactUpdateInput = {
    AccContFirstName?: StringFieldUpdateOperationsInput | string;
    AccContLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUpdateOneRequiredWithoutAccountContactNestedInput;
  };

  export type AccountContactUncheckedUpdateInput = {
    AccContId?: IntFieldUpdateOperationsInput | number;
    AccContAccountId?: IntFieldUpdateOperationsInput | number;
    AccContFirstName?: StringFieldUpdateOperationsInput | string;
    AccContLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountContactCreateManyInput = {
    AccContId?: number;
    AccContAccountId: number;
    AccContFirstName: string;
    AccContLastName?: string | null;
    AccContPhone?: string | null;
    AccContMainEmail?: string | null;
  };

  export type AccountContactUpdateManyMutationInput = {
    AccContFirstName?: StringFieldUpdateOperationsInput | string;
    AccContLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountContactUncheckedUpdateManyInput = {
    AccContId?: IntFieldUpdateOperationsInput | number;
    AccContAccountId?: IntFieldUpdateOperationsInput | number;
    AccContFirstName?: StringFieldUpdateOperationsInput | string;
    AccContLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountSubscriptionCreateInput = {
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
    Account: AccountCreateNestedOneWithoutAccountSubscriptionInput;
    SubscriptionPlan: SubscriptionPlanCreateNestedOneWithoutAccountSubscriptionInput;
  };

  export type AccountSubscriptionUncheckedCreateInput = {
    AccSubId?: number;
    AccSubAccountId: number;
    AccSubPlanId: number;
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
  };

  export type AccountSubscriptionUpdateInput = {
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    Account?: AccountUpdateOneRequiredWithoutAccountSubscriptionNestedInput;
    SubscriptionPlan?: SubscriptionPlanUpdateOneRequiredWithoutAccountSubscriptionNestedInput;
  };

  export type AccountSubscriptionUncheckedUpdateInput = {
    AccSubId?: IntFieldUpdateOperationsInput | number;
    AccSubAccountId?: IntFieldUpdateOperationsInput | number;
    AccSubPlanId?: IntFieldUpdateOperationsInput | number;
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
  };

  export type AccountSubscriptionCreateManyInput = {
    AccSubId?: number;
    AccSubAccountId: number;
    AccSubPlanId: number;
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
  };

  export type AccountSubscriptionUpdateManyMutationInput = {
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
  };

  export type AccountSubscriptionUncheckedUpdateManyInput = {
    AccSubId?: IntFieldUpdateOperationsInput | number;
    AccSubAccountId?: IntFieldUpdateOperationsInput | number;
    AccSubPlanId?: IntFieldUpdateOperationsInput | number;
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
  };

  export type AccountUserCreateInput = {
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
    Account: AccountCreateNestedOneWithoutAccountUserInput;
    User: UserCreateNestedOneWithoutAccountUserInput;
    AccountUserPermission?: AccountUserPermissionCreateNestedManyWithoutAccountUserInput;
  };

  export type AccountUserUncheckedCreateInput = {
    AccUserId?: number;
    AccUserUserId: number;
    AccUserAccountId: number;
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
    AccountUserPermission?: AccountUserPermissionUncheckedCreateNestedManyWithoutAccountUserInput;
  };

  export type AccountUserUpdateInput = {
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUpdateOneRequiredWithoutAccountUserNestedInput;
    User?: UserUpdateOneRequiredWithoutAccountUserNestedInput;
    AccountUserPermission?: AccountUserPermissionUpdateManyWithoutAccountUserNestedInput;
  };

  export type AccountUserUncheckedUpdateInput = {
    AccUserId?: IntFieldUpdateOperationsInput | number;
    AccUserUserId?: IntFieldUpdateOperationsInput | number;
    AccUserAccountId?: IntFieldUpdateOperationsInput | number;
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountUserPermission?: AccountUserPermissionUncheckedUpdateManyWithoutAccountUserNestedInput;
  };

  export type AccountUserCreateManyInput = {
    AccUserId?: number;
    AccUserUserId: number;
    AccUserAccountId: number;
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
  };

  export type AccountUserUpdateManyMutationInput = {
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountUserUncheckedUpdateManyInput = {
    AccUserId?: IntFieldUpdateOperationsInput | number;
    AccUserUserId?: IntFieldUpdateOperationsInput | number;
    AccUserAccountId?: IntFieldUpdateOperationsInput | number;
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountUserPermissionCreateInput = {
    AccountUser: AccountUserCreateNestedOneWithoutAccountUserPermissionInput;
    Permission: PermissionCreateNestedOneWithoutAccountUserPermissionInput;
  };

  export type AccountUserPermissionUncheckedCreateInput = {
    UserAuthId?: number;
    UserAuthAccUserId: number;
    UserAuthPermissionId: number;
  };

  export type AccountUserPermissionUpdateInput = {
    AccountUser?: AccountUserUpdateOneRequiredWithoutAccountUserPermissionNestedInput;
    Permission?: PermissionUpdateOneRequiredWithoutAccountUserPermissionNestedInput;
  };

  export type AccountUserPermissionUncheckedUpdateInput = {
    UserAuthId?: IntFieldUpdateOperationsInput | number;
    UserAuthAccUserId?: IntFieldUpdateOperationsInput | number;
    UserAuthPermissionId?: IntFieldUpdateOperationsInput | number;
  };

  export type AccountUserPermissionCreateManyInput = {
    UserAuthId?: number;
    UserAuthAccUserId: number;
    UserAuthPermissionId: number;
  };

  export type AccountUserPermissionUpdateManyMutationInput = {};

  export type AccountUserPermissionUncheckedUpdateManyInput = {
    UserAuthId?: IntFieldUpdateOperationsInput | number;
    UserAuthAccUserId?: IntFieldUpdateOperationsInput | number;
    UserAuthPermissionId?: IntFieldUpdateOperationsInput | number;
  };

  export type CurrencyCreateInput = {
    CurrencyCode: string;
    CurrencyName: string;
    CurrencySymbolUnicode?: string | null;
    Account?: AccountCreateNestedManyWithoutCurrencyInput;
  };

  export type CurrencyUncheckedCreateInput = {
    CurrencyCode: string;
    CurrencyName: string;
    CurrencySymbolUnicode?: string | null;
    Account?: AccountUncheckedCreateNestedManyWithoutCurrencyInput;
  };

  export type CurrencyUpdateInput = {
    CurrencyCode?: StringFieldUpdateOperationsInput | string;
    CurrencyName?: StringFieldUpdateOperationsInput | string;
    CurrencySymbolUnicode?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUpdateManyWithoutCurrencyNestedInput;
  };

  export type CurrencyUncheckedUpdateInput = {
    CurrencyCode?: StringFieldUpdateOperationsInput | string;
    CurrencyName?: StringFieldUpdateOperationsInput | string;
    CurrencySymbolUnicode?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUncheckedUpdateManyWithoutCurrencyNestedInput;
  };

  export type CurrencyCreateManyInput = {
    CurrencyCode: string;
    CurrencyName: string;
    CurrencySymbolUnicode?: string | null;
  };

  export type CurrencyUpdateManyMutationInput = {
    CurrencyCode?: StringFieldUpdateOperationsInput | string;
    CurrencyName?: StringFieldUpdateOperationsInput | string;
    CurrencySymbolUnicode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CurrencyUncheckedUpdateManyInput = {
    CurrencyCode?: StringFieldUpdateOperationsInput | string;
    CurrencyName?: StringFieldUpdateOperationsInput | string;
    CurrencySymbolUnicode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type DBSettingCreateInput = {
    DBSettingName: string;
    DBSettingValue: string;
  };

  export type DBSettingUncheckedCreateInput = {
    DBSettingId?: number;
    DBSettingName: string;
    DBSettingValue: string;
  };

  export type DBSettingUpdateInput = {
    DBSettingName?: StringFieldUpdateOperationsInput | string;
    DBSettingValue?: StringFieldUpdateOperationsInput | string;
  };

  export type DBSettingUncheckedUpdateInput = {
    DBSettingId?: IntFieldUpdateOperationsInput | number;
    DBSettingName?: StringFieldUpdateOperationsInput | string;
    DBSettingValue?: StringFieldUpdateOperationsInput | string;
  };

  export type DBSettingCreateManyInput = {
    DBSettingId?: number;
    DBSettingName: string;
    DBSettingValue: string;
  };

  export type DBSettingUpdateManyMutationInput = {
    DBSettingName?: StringFieldUpdateOperationsInput | string;
    DBSettingValue?: StringFieldUpdateOperationsInput | string;
  };

  export type DBSettingUncheckedUpdateManyInput = {
    DBSettingId?: IntFieldUpdateOperationsInput | number;
    DBSettingName?: StringFieldUpdateOperationsInput | string;
    DBSettingValue?: StringFieldUpdateOperationsInput | string;
  };

  export type FileCreateInput = {
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileSizeBytes?: bigint | number | null;
    Account?: AccountCreateNestedManyWithoutFileInput;
    User: UserCreateNestedOneWithoutFileInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutFileInput;
  };

  export type FileUncheckedCreateInput = {
    FileId?: number;
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileUploadUserId: number;
    FileSizeBytes?: bigint | number | null;
    Account?: AccountUncheckedCreateNestedManyWithoutFileInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutFileInput;
  };

  export type FileUpdateInput = {
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    Account?: AccountUpdateManyWithoutFileNestedInput;
    User?: UserUpdateOneRequiredWithoutFileNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutFileNestedInput;
  };

  export type FileUncheckedUpdateInput = {
    FileId?: IntFieldUpdateOperationsInput | number;
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileUploadUserId?: IntFieldUpdateOperationsInput | number;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    Account?: AccountUncheckedUpdateManyWithoutFileNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutFileNestedInput;
  };

  export type FileCreateManyInput = {
    FileId?: number;
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileUploadUserId: number;
    FileSizeBytes?: bigint | number | null;
  };

  export type FileUpdateManyMutationInput = {
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
  };

  export type FileUncheckedUpdateManyInput = {
    FileId?: IntFieldUpdateOperationsInput | number;
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileUploadUserId?: IntFieldUpdateOperationsInput | number;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
  };

  export type PermissionCreateInput = {
    PermissionParentPermissionId?: number | null;
    PermissionName: string;
    PermissionDescription: string;
    PermissionSeqNo?: number | null;
    AccountUserPermission?: AccountUserPermissionCreateNestedManyWithoutPermissionInput;
  };

  export type PermissionUncheckedCreateInput = {
    PermissionId?: number;
    PermissionParentPermissionId?: number | null;
    PermissionName: string;
    PermissionDescription: string;
    PermissionSeqNo?: number | null;
    AccountUserPermission?: AccountUserPermissionUncheckedCreateNestedManyWithoutPermissionInput;
  };

  export type PermissionUpdateInput = {
    PermissionParentPermissionId?: NullableIntFieldUpdateOperationsInput | number | null;
    PermissionName?: StringFieldUpdateOperationsInput | string;
    PermissionDescription?: StringFieldUpdateOperationsInput | string;
    PermissionSeqNo?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountUserPermission?: AccountUserPermissionUpdateManyWithoutPermissionNestedInput;
  };

  export type PermissionUncheckedUpdateInput = {
    PermissionId?: IntFieldUpdateOperationsInput | number;
    PermissionParentPermissionId?: NullableIntFieldUpdateOperationsInput | number | null;
    PermissionName?: StringFieldUpdateOperationsInput | string;
    PermissionDescription?: StringFieldUpdateOperationsInput | string;
    PermissionSeqNo?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountUserPermission?: AccountUserPermissionUncheckedUpdateManyWithoutPermissionNestedInput;
  };

  export type PermissionCreateManyInput = {
    PermissionId?: number;
    PermissionParentPermissionId?: number | null;
    PermissionName: string;
    PermissionDescription: string;
    PermissionSeqNo?: number | null;
  };

  export type PermissionUpdateManyMutationInput = {
    PermissionParentPermissionId?: NullableIntFieldUpdateOperationsInput | number | null;
    PermissionName?: StringFieldUpdateOperationsInput | string;
    PermissionDescription?: StringFieldUpdateOperationsInput | string;
    PermissionSeqNo?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type PermissionUncheckedUpdateManyInput = {
    PermissionId?: IntFieldUpdateOperationsInput | number;
    PermissionParentPermissionId?: NullableIntFieldUpdateOperationsInput | number | null;
    PermissionName?: StringFieldUpdateOperationsInput | string;
    PermissionDescription?: StringFieldUpdateOperationsInput | string;
    PermissionSeqNo?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type ProductionCompanyCreateInput = {
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
    Account: AccountCreateNestedOneWithoutProductionCompanyInput;
    File?: FileCreateNestedOneWithoutProductionCompanyInput;
  };

  export type ProductionCompanyUncheckedCreateInput = {
    ProdCoId?: number;
    ProdCoAccountId: number;
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
    ProdCoLogoFileId?: number | null;
  };

  export type ProductionCompanyUpdateInput = {
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUpdateOneRequiredWithoutProductionCompanyNestedInput;
    File?: FileUpdateOneWithoutProductionCompanyNestedInput;
  };

  export type ProductionCompanyUncheckedUpdateInput = {
    ProdCoId?: IntFieldUpdateOperationsInput | number;
    ProdCoAccountId?: IntFieldUpdateOperationsInput | number;
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type ProductionCompanyCreateManyInput = {
    ProdCoId?: number;
    ProdCoAccountId: number;
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
    ProdCoLogoFileId?: number | null;
  };

  export type ProductionCompanyUpdateManyMutationInput = {
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ProductionCompanyUncheckedUpdateManyInput = {
    ProdCoId?: IntFieldUpdateOperationsInput | number;
    ProdCoAccountId?: IntFieldUpdateOperationsInput | number;
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type SubscriptionPlanCreateInput = {
    PlanName: string;
    PlanDescription?: string | null;
    PlanPrice: Decimal | DecimalJsLike | number | string;
    PlanFrequency: number;
    PlanPriceId?: string | null;
    PlanCurrency: string;
    AccountSubscription?: AccountSubscriptionCreateNestedManyWithoutSubscriptionPlanInput;
  };

  export type SubscriptionPlanUncheckedCreateInput = {
    PlanId?: number;
    PlanName: string;
    PlanDescription?: string | null;
    PlanPrice: Decimal | DecimalJsLike | number | string;
    PlanFrequency: number;
    PlanPriceId?: string | null;
    PlanCurrency: string;
    AccountSubscription?: AccountSubscriptionUncheckedCreateNestedManyWithoutSubscriptionPlanInput;
  };

  export type SubscriptionPlanUpdateInput = {
    PlanName?: StringFieldUpdateOperationsInput | string;
    PlanDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntFieldUpdateOperationsInput | number;
    PlanPriceId?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanCurrency?: StringFieldUpdateOperationsInput | string;
    AccountSubscription?: AccountSubscriptionUpdateManyWithoutSubscriptionPlanNestedInput;
  };

  export type SubscriptionPlanUncheckedUpdateInput = {
    PlanId?: IntFieldUpdateOperationsInput | number;
    PlanName?: StringFieldUpdateOperationsInput | string;
    PlanDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntFieldUpdateOperationsInput | number;
    PlanPriceId?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanCurrency?: StringFieldUpdateOperationsInput | string;
    AccountSubscription?: AccountSubscriptionUncheckedUpdateManyWithoutSubscriptionPlanNestedInput;
  };

  export type SubscriptionPlanCreateManyInput = {
    PlanId?: number;
    PlanName: string;
    PlanDescription?: string | null;
    PlanPrice: Decimal | DecimalJsLike | number | string;
    PlanFrequency: number;
    PlanPriceId?: string | null;
    PlanCurrency: string;
  };

  export type SubscriptionPlanUpdateManyMutationInput = {
    PlanName?: StringFieldUpdateOperationsInput | string;
    PlanDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntFieldUpdateOperationsInput | number;
    PlanPriceId?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanCurrency?: StringFieldUpdateOperationsInput | string;
  };

  export type SubscriptionPlanUncheckedUpdateManyInput = {
    PlanId?: IntFieldUpdateOperationsInput | number;
    PlanName?: StringFieldUpdateOperationsInput | string;
    PlanDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntFieldUpdateOperationsInput | number;
    PlanPriceId?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanCurrency?: StringFieldUpdateOperationsInput | string;
  };

  export type UserCreateInput = {
    UserEmail: string;
    UserFirstName: string;
    UserLastName?: string | null;
    AccountUser?: AccountUserCreateNestedOneWithoutUserInput;
    File?: FileCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    UserId?: number;
    UserEmail: string;
    UserFirstName: string;
    UserLastName?: string | null;
    AccountUser?: AccountUserUncheckedCreateNestedOneWithoutUserInput;
    File?: FileUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountUser?: AccountUserUpdateOneWithoutUserNestedInput;
    File?: FileUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    UserId?: IntFieldUpdateOperationsInput | number;
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountUser?: AccountUserUncheckedUpdateOneWithoutUserNestedInput;
    File?: FileUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateManyInput = {
    UserId?: number;
    UserEmail: string;
    UserFirstName: string;
    UserLastName?: string | null;
  };

  export type UserUpdateManyMutationInput = {
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type UserUncheckedUpdateManyInput = {
    UserId?: IntFieldUpdateOperationsInput | number;
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type CurrencyNullableRelationFilter = {
    is?: CurrencyWhereInput | null;
    isNot?: CurrencyWhereInput | null;
  };

  export type FileNullableRelationFilter = {
    is?: FileWhereInput | null;
    isNot?: FileWhereInput | null;
  };

  export type AccountContactListRelationFilter = {
    every?: AccountContactWhereInput;
    some?: AccountContactWhereInput;
    none?: AccountContactWhereInput;
  };

  export type AccountSubscriptionListRelationFilter = {
    every?: AccountSubscriptionWhereInput;
    some?: AccountSubscriptionWhereInput;
    none?: AccountSubscriptionWhereInput;
  };

  export type AccountUserListRelationFilter = {
    every?: AccountUserWhereInput;
    some?: AccountUserWhereInput;
    none?: AccountUserWhereInput;
  };

  export type ProductionCompanyListRelationFilter = {
    every?: ProductionCompanyWhereInput;
    some?: ProductionCompanyWhereInput;
    none?: ProductionCompanyWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type AccountContactOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AccountSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AccountUserOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ProductionCompanyOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AccountCountOrderByAggregateInput = {
    AccountId?: SortOrder;
    AccountName?: SortOrder;
    AccountAddress1?: SortOrder;
    AccountAddress2?: SortOrder;
    AccountAddress3?: SortOrder;
    AccountAddressTown?: SortOrder;
    AccountAddressCounty?: SortOrder;
    AccountAddressPostcode?: SortOrder;
    AccountAddressCountry?: SortOrder;
    AccountVATNumber?: SortOrder;
    AccountCurrencyCode?: SortOrder;
    AccountCompanyNumber?: SortOrder;
    AccountLogoFileId?: SortOrder;
    AccountMainEmail?: SortOrder;
    AccountNumPeople?: SortOrder;
    AccountOrganisationId?: SortOrder;
    AccountTermsAgreedBy?: SortOrder;
    AccountTermsAgreedDate?: SortOrder;
    AccountWebsite?: SortOrder;
    AccountTypeOfCompany?: SortOrder;
    AccountPhone?: SortOrder;
    AccountPaymentCurrencyCode?: SortOrder;
  };

  export type AccountAvgOrderByAggregateInput = {
    AccountId?: SortOrder;
    AccountLogoFileId?: SortOrder;
    AccountNumPeople?: SortOrder;
  };

  export type AccountMaxOrderByAggregateInput = {
    AccountId?: SortOrder;
    AccountName?: SortOrder;
    AccountAddress1?: SortOrder;
    AccountAddress2?: SortOrder;
    AccountAddress3?: SortOrder;
    AccountAddressTown?: SortOrder;
    AccountAddressCounty?: SortOrder;
    AccountAddressPostcode?: SortOrder;
    AccountAddressCountry?: SortOrder;
    AccountVATNumber?: SortOrder;
    AccountCurrencyCode?: SortOrder;
    AccountCompanyNumber?: SortOrder;
    AccountLogoFileId?: SortOrder;
    AccountMainEmail?: SortOrder;
    AccountNumPeople?: SortOrder;
    AccountOrganisationId?: SortOrder;
    AccountTermsAgreedBy?: SortOrder;
    AccountTermsAgreedDate?: SortOrder;
    AccountWebsite?: SortOrder;
    AccountTypeOfCompany?: SortOrder;
    AccountPhone?: SortOrder;
    AccountPaymentCurrencyCode?: SortOrder;
  };

  export type AccountMinOrderByAggregateInput = {
    AccountId?: SortOrder;
    AccountName?: SortOrder;
    AccountAddress1?: SortOrder;
    AccountAddress2?: SortOrder;
    AccountAddress3?: SortOrder;
    AccountAddressTown?: SortOrder;
    AccountAddressCounty?: SortOrder;
    AccountAddressPostcode?: SortOrder;
    AccountAddressCountry?: SortOrder;
    AccountVATNumber?: SortOrder;
    AccountCurrencyCode?: SortOrder;
    AccountCompanyNumber?: SortOrder;
    AccountLogoFileId?: SortOrder;
    AccountMainEmail?: SortOrder;
    AccountNumPeople?: SortOrder;
    AccountOrganisationId?: SortOrder;
    AccountTermsAgreedBy?: SortOrder;
    AccountTermsAgreedDate?: SortOrder;
    AccountWebsite?: SortOrder;
    AccountTypeOfCompany?: SortOrder;
    AccountPhone?: SortOrder;
    AccountPaymentCurrencyCode?: SortOrder;
  };

  export type AccountSumOrderByAggregateInput = {
    AccountId?: SortOrder;
    AccountLogoFileId?: SortOrder;
    AccountNumPeople?: SortOrder;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type AccountRelationFilter = {
    is?: AccountWhereInput;
    isNot?: AccountWhereInput;
  };

  export type AccountContactCountOrderByAggregateInput = {
    AccContId?: SortOrder;
    AccContAccountId?: SortOrder;
    AccContFirstName?: SortOrder;
    AccContLastName?: SortOrder;
    AccContPhone?: SortOrder;
    AccContMainEmail?: SortOrder;
  };

  export type AccountContactAvgOrderByAggregateInput = {
    AccContId?: SortOrder;
    AccContAccountId?: SortOrder;
  };

  export type AccountContactMaxOrderByAggregateInput = {
    AccContId?: SortOrder;
    AccContAccountId?: SortOrder;
    AccContFirstName?: SortOrder;
    AccContLastName?: SortOrder;
    AccContPhone?: SortOrder;
    AccContMainEmail?: SortOrder;
  };

  export type AccountContactMinOrderByAggregateInput = {
    AccContId?: SortOrder;
    AccContAccountId?: SortOrder;
    AccContFirstName?: SortOrder;
    AccContLastName?: SortOrder;
    AccContPhone?: SortOrder;
    AccContMainEmail?: SortOrder;
  };

  export type AccountContactSumOrderByAggregateInput = {
    AccContId?: SortOrder;
    AccContAccountId?: SortOrder;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type SubscriptionPlanRelationFilter = {
    is?: SubscriptionPlanWhereInput;
    isNot?: SubscriptionPlanWhereInput;
  };

  export type AccountSubscriptionCountOrderByAggregateInput = {
    AccSubId?: SortOrder;
    AccSubAccountId?: SortOrder;
    AccSubPlanId?: SortOrder;
    AccSubStartDate?: SortOrder;
    AccSubEndDate?: SortOrder;
    AccSubIsActive?: SortOrder;
  };

  export type AccountSubscriptionAvgOrderByAggregateInput = {
    AccSubId?: SortOrder;
    AccSubAccountId?: SortOrder;
    AccSubPlanId?: SortOrder;
  };

  export type AccountSubscriptionMaxOrderByAggregateInput = {
    AccSubId?: SortOrder;
    AccSubAccountId?: SortOrder;
    AccSubPlanId?: SortOrder;
    AccSubStartDate?: SortOrder;
    AccSubEndDate?: SortOrder;
    AccSubIsActive?: SortOrder;
  };

  export type AccountSubscriptionMinOrderByAggregateInput = {
    AccSubId?: SortOrder;
    AccSubAccountId?: SortOrder;
    AccSubPlanId?: SortOrder;
    AccSubStartDate?: SortOrder;
    AccSubEndDate?: SortOrder;
    AccSubIsActive?: SortOrder;
  };

  export type AccountSubscriptionSumOrderByAggregateInput = {
    AccSubId?: SortOrder;
    AccSubAccountId?: SortOrder;
    AccSubPlanId?: SortOrder;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type UserRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type AccountUserPermissionListRelationFilter = {
    every?: AccountUserPermissionWhereInput;
    some?: AccountUserPermissionWhereInput;
    none?: AccountUserPermissionWhereInput;
  };

  export type AccountUserPermissionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AccountUserCountOrderByAggregateInput = {
    AccUserId?: SortOrder;
    AccUserUserId?: SortOrder;
    AccUserAccountId?: SortOrder;
    AccUserIsAdmin?: SortOrder;
    AccUserPIN?: SortOrder;
  };

  export type AccountUserAvgOrderByAggregateInput = {
    AccUserId?: SortOrder;
    AccUserUserId?: SortOrder;
    AccUserAccountId?: SortOrder;
  };

  export type AccountUserMaxOrderByAggregateInput = {
    AccUserId?: SortOrder;
    AccUserUserId?: SortOrder;
    AccUserAccountId?: SortOrder;
    AccUserIsAdmin?: SortOrder;
    AccUserPIN?: SortOrder;
  };

  export type AccountUserMinOrderByAggregateInput = {
    AccUserId?: SortOrder;
    AccUserUserId?: SortOrder;
    AccUserAccountId?: SortOrder;
    AccUserIsAdmin?: SortOrder;
    AccUserPIN?: SortOrder;
  };

  export type AccountUserSumOrderByAggregateInput = {
    AccUserId?: SortOrder;
    AccUserUserId?: SortOrder;
    AccUserAccountId?: SortOrder;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type AccountUserRelationFilter = {
    is?: AccountUserWhereInput;
    isNot?: AccountUserWhereInput;
  };

  export type PermissionRelationFilter = {
    is?: PermissionWhereInput;
    isNot?: PermissionWhereInput;
  };

  export type AccountUserPermissionCountOrderByAggregateInput = {
    UserAuthId?: SortOrder;
    UserAuthAccUserId?: SortOrder;
    UserAuthPermissionId?: SortOrder;
  };

  export type AccountUserPermissionAvgOrderByAggregateInput = {
    UserAuthId?: SortOrder;
    UserAuthAccUserId?: SortOrder;
    UserAuthPermissionId?: SortOrder;
  };

  export type AccountUserPermissionMaxOrderByAggregateInput = {
    UserAuthId?: SortOrder;
    UserAuthAccUserId?: SortOrder;
    UserAuthPermissionId?: SortOrder;
  };

  export type AccountUserPermissionMinOrderByAggregateInput = {
    UserAuthId?: SortOrder;
    UserAuthAccUserId?: SortOrder;
    UserAuthPermissionId?: SortOrder;
  };

  export type AccountUserPermissionSumOrderByAggregateInput = {
    UserAuthId?: SortOrder;
    UserAuthAccUserId?: SortOrder;
    UserAuthPermissionId?: SortOrder;
  };

  export type AccountListRelationFilter = {
    every?: AccountWhereInput;
    some?: AccountWhereInput;
    none?: AccountWhereInput;
  };

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CurrencyCountOrderByAggregateInput = {
    CurrencyCode?: SortOrder;
    CurrencyName?: SortOrder;
    CurrencySymbolUnicode?: SortOrder;
  };

  export type CurrencyMaxOrderByAggregateInput = {
    CurrencyCode?: SortOrder;
    CurrencyName?: SortOrder;
    CurrencySymbolUnicode?: SortOrder;
  };

  export type CurrencyMinOrderByAggregateInput = {
    CurrencyCode?: SortOrder;
    CurrencyName?: SortOrder;
    CurrencySymbolUnicode?: SortOrder;
  };

  export type DBSettingCountOrderByAggregateInput = {
    DBSettingId?: SortOrder;
    DBSettingName?: SortOrder;
    DBSettingValue?: SortOrder;
  };

  export type DBSettingAvgOrderByAggregateInput = {
    DBSettingId?: SortOrder;
  };

  export type DBSettingMaxOrderByAggregateInput = {
    DBSettingId?: SortOrder;
    DBSettingName?: SortOrder;
    DBSettingValue?: SortOrder;
  };

  export type DBSettingMinOrderByAggregateInput = {
    DBSettingId?: SortOrder;
    DBSettingName?: SortOrder;
    DBSettingValue?: SortOrder;
  };

  export type DBSettingSumOrderByAggregateInput = {
    DBSettingId?: SortOrder;
  };

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null;
    in?: bigint[] | number[] | null;
    notIn?: bigint[] | number[] | null;
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null;
  };

  export type FileCountOrderByAggregateInput = {
    FileId?: SortOrder;
    FileOriginalFilename?: SortOrder;
    FileMediaType?: SortOrder;
    FileLocation?: SortOrder;
    FileUploadDateTime?: SortOrder;
    FileUploadUserId?: SortOrder;
    FileSizeBytes?: SortOrder;
  };

  export type FileAvgOrderByAggregateInput = {
    FileId?: SortOrder;
    FileUploadUserId?: SortOrder;
    FileSizeBytes?: SortOrder;
  };

  export type FileMaxOrderByAggregateInput = {
    FileId?: SortOrder;
    FileOriginalFilename?: SortOrder;
    FileMediaType?: SortOrder;
    FileLocation?: SortOrder;
    FileUploadDateTime?: SortOrder;
    FileUploadUserId?: SortOrder;
    FileSizeBytes?: SortOrder;
  };

  export type FileMinOrderByAggregateInput = {
    FileId?: SortOrder;
    FileOriginalFilename?: SortOrder;
    FileMediaType?: SortOrder;
    FileLocation?: SortOrder;
    FileUploadDateTime?: SortOrder;
    FileUploadUserId?: SortOrder;
    FileSizeBytes?: SortOrder;
  };

  export type FileSumOrderByAggregateInput = {
    FileId?: SortOrder;
    FileUploadUserId?: SortOrder;
    FileSizeBytes?: SortOrder;
  };

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null;
    in?: bigint[] | number[] | null;
    notIn?: bigint[] | number[] | null;
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedBigIntNullableFilter<$PrismaModel>;
    _min?: NestedBigIntNullableFilter<$PrismaModel>;
    _max?: NestedBigIntNullableFilter<$PrismaModel>;
  };

  export type PermissionCountOrderByAggregateInput = {
    PermissionId?: SortOrder;
    PermissionParentPermissionId?: SortOrder;
    PermissionName?: SortOrder;
    PermissionDescription?: SortOrder;
    PermissionSeqNo?: SortOrder;
  };

  export type PermissionAvgOrderByAggregateInput = {
    PermissionId?: SortOrder;
    PermissionParentPermissionId?: SortOrder;
    PermissionSeqNo?: SortOrder;
  };

  export type PermissionMaxOrderByAggregateInput = {
    PermissionId?: SortOrder;
    PermissionParentPermissionId?: SortOrder;
    PermissionName?: SortOrder;
    PermissionDescription?: SortOrder;
    PermissionSeqNo?: SortOrder;
  };

  export type PermissionMinOrderByAggregateInput = {
    PermissionId?: SortOrder;
    PermissionParentPermissionId?: SortOrder;
    PermissionName?: SortOrder;
    PermissionDescription?: SortOrder;
    PermissionSeqNo?: SortOrder;
  };

  export type PermissionSumOrderByAggregateInput = {
    PermissionId?: SortOrder;
    PermissionParentPermissionId?: SortOrder;
    PermissionSeqNo?: SortOrder;
  };

  export type ProductionCompanyCountOrderByAggregateInput = {
    ProdCoId?: SortOrder;
    ProdCoAccountId?: SortOrder;
    ProdCoName?: SortOrder;
    ProdCoWebSite?: SortOrder;
    ProdCoSaleStartWeek?: SortOrder;
    ProdCoVATCode?: SortOrder;
    ProdCoLogoFileId?: SortOrder;
  };

  export type ProductionCompanyAvgOrderByAggregateInput = {
    ProdCoId?: SortOrder;
    ProdCoAccountId?: SortOrder;
    ProdCoSaleStartWeek?: SortOrder;
    ProdCoLogoFileId?: SortOrder;
  };

  export type ProductionCompanyMaxOrderByAggregateInput = {
    ProdCoId?: SortOrder;
    ProdCoAccountId?: SortOrder;
    ProdCoName?: SortOrder;
    ProdCoWebSite?: SortOrder;
    ProdCoSaleStartWeek?: SortOrder;
    ProdCoVATCode?: SortOrder;
    ProdCoLogoFileId?: SortOrder;
  };

  export type ProductionCompanyMinOrderByAggregateInput = {
    ProdCoId?: SortOrder;
    ProdCoAccountId?: SortOrder;
    ProdCoName?: SortOrder;
    ProdCoWebSite?: SortOrder;
    ProdCoSaleStartWeek?: SortOrder;
    ProdCoVATCode?: SortOrder;
    ProdCoLogoFileId?: SortOrder;
  };

  export type ProductionCompanySumOrderByAggregateInput = {
    ProdCoId?: SortOrder;
    ProdCoAccountId?: SortOrder;
    ProdCoSaleStartWeek?: SortOrder;
    ProdCoLogoFileId?: SortOrder;
  };

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[];
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[];
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string;
  };

  export type SubscriptionPlanCountOrderByAggregateInput = {
    PlanId?: SortOrder;
    PlanName?: SortOrder;
    PlanDescription?: SortOrder;
    PlanPrice?: SortOrder;
    PlanFrequency?: SortOrder;
    PlanPriceId?: SortOrder;
    PlanCurrency?: SortOrder;
  };

  export type SubscriptionPlanAvgOrderByAggregateInput = {
    PlanId?: SortOrder;
    PlanPrice?: SortOrder;
    PlanFrequency?: SortOrder;
  };

  export type SubscriptionPlanMaxOrderByAggregateInput = {
    PlanId?: SortOrder;
    PlanName?: SortOrder;
    PlanDescription?: SortOrder;
    PlanPrice?: SortOrder;
    PlanFrequency?: SortOrder;
    PlanPriceId?: SortOrder;
    PlanCurrency?: SortOrder;
  };

  export type SubscriptionPlanMinOrderByAggregateInput = {
    PlanId?: SortOrder;
    PlanName?: SortOrder;
    PlanDescription?: SortOrder;
    PlanPrice?: SortOrder;
    PlanFrequency?: SortOrder;
    PlanPriceId?: SortOrder;
    PlanCurrency?: SortOrder;
  };

  export type SubscriptionPlanSumOrderByAggregateInput = {
    PlanId?: SortOrder;
    PlanPrice?: SortOrder;
    PlanFrequency?: SortOrder;
  };

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[];
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[];
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type AccountUserNullableRelationFilter = {
    is?: AccountUserWhereInput | null;
    isNot?: AccountUserWhereInput | null;
  };

  export type FileListRelationFilter = {
    every?: FileWhereInput;
    some?: FileWhereInput;
    none?: FileWhereInput;
  };

  export type FileOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    UserId?: SortOrder;
    UserEmail?: SortOrder;
    UserFirstName?: SortOrder;
    UserLastName?: SortOrder;
  };

  export type UserAvgOrderByAggregateInput = {
    UserId?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    UserId?: SortOrder;
    UserEmail?: SortOrder;
    UserFirstName?: SortOrder;
    UserLastName?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    UserId?: SortOrder;
    UserEmail?: SortOrder;
    UserFirstName?: SortOrder;
    UserLastName?: SortOrder;
  };

  export type UserSumOrderByAggregateInput = {
    UserId?: SortOrder;
  };

  export type CurrencyCreateNestedOneWithoutAccountInput = {
    create?: XOR<CurrencyCreateWithoutAccountInput, CurrencyUncheckedCreateWithoutAccountInput>;
    connectOrCreate?: CurrencyCreateOrConnectWithoutAccountInput;
    connect?: CurrencyWhereUniqueInput;
  };

  export type FileCreateNestedOneWithoutAccountInput = {
    create?: XOR<FileCreateWithoutAccountInput, FileUncheckedCreateWithoutAccountInput>;
    connectOrCreate?: FileCreateOrConnectWithoutAccountInput;
    connect?: FileWhereUniqueInput;
  };

  export type AccountContactCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<AccountContactCreateWithoutAccountInput, AccountContactUncheckedCreateWithoutAccountInput>
      | AccountContactCreateWithoutAccountInput[]
      | AccountContactUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountContactCreateOrConnectWithoutAccountInput
      | AccountContactCreateOrConnectWithoutAccountInput[];
    createMany?: AccountContactCreateManyAccountInputEnvelope;
    connect?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
  };

  export type AccountSubscriptionCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<AccountSubscriptionCreateWithoutAccountInput, AccountSubscriptionUncheckedCreateWithoutAccountInput>
      | AccountSubscriptionCreateWithoutAccountInput[]
      | AccountSubscriptionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutAccountInput
      | AccountSubscriptionCreateOrConnectWithoutAccountInput[];
    createMany?: AccountSubscriptionCreateManyAccountInputEnvelope;
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
  };

  export type AccountUserCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<AccountUserCreateWithoutAccountInput, AccountUserUncheckedCreateWithoutAccountInput>
      | AccountUserCreateWithoutAccountInput[]
      | AccountUserUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: AccountUserCreateOrConnectWithoutAccountInput | AccountUserCreateOrConnectWithoutAccountInput[];
    createMany?: AccountUserCreateManyAccountInputEnvelope;
    connect?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
  };

  export type ProductionCompanyCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutAccountInput, ProductionCompanyUncheckedCreateWithoutAccountInput>
      | ProductionCompanyCreateWithoutAccountInput[]
      | ProductionCompanyUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutAccountInput
      | ProductionCompanyCreateOrConnectWithoutAccountInput[];
    createMany?: ProductionCompanyCreateManyAccountInputEnvelope;
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
  };

  export type AccountContactUncheckedCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<AccountContactCreateWithoutAccountInput, AccountContactUncheckedCreateWithoutAccountInput>
      | AccountContactCreateWithoutAccountInput[]
      | AccountContactUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountContactCreateOrConnectWithoutAccountInput
      | AccountContactCreateOrConnectWithoutAccountInput[];
    createMany?: AccountContactCreateManyAccountInputEnvelope;
    connect?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
  };

  export type AccountSubscriptionUncheckedCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<AccountSubscriptionCreateWithoutAccountInput, AccountSubscriptionUncheckedCreateWithoutAccountInput>
      | AccountSubscriptionCreateWithoutAccountInput[]
      | AccountSubscriptionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutAccountInput
      | AccountSubscriptionCreateOrConnectWithoutAccountInput[];
    createMany?: AccountSubscriptionCreateManyAccountInputEnvelope;
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
  };

  export type AccountUserUncheckedCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<AccountUserCreateWithoutAccountInput, AccountUserUncheckedCreateWithoutAccountInput>
      | AccountUserCreateWithoutAccountInput[]
      | AccountUserUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: AccountUserCreateOrConnectWithoutAccountInput | AccountUserCreateOrConnectWithoutAccountInput[];
    createMany?: AccountUserCreateManyAccountInputEnvelope;
    connect?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
  };

  export type ProductionCompanyUncheckedCreateNestedManyWithoutAccountInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutAccountInput, ProductionCompanyUncheckedCreateWithoutAccountInput>
      | ProductionCompanyCreateWithoutAccountInput[]
      | ProductionCompanyUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutAccountInput
      | ProductionCompanyCreateOrConnectWithoutAccountInput[];
    createMany?: ProductionCompanyCreateManyAccountInputEnvelope;
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type CurrencyUpdateOneWithoutAccountNestedInput = {
    create?: XOR<CurrencyCreateWithoutAccountInput, CurrencyUncheckedCreateWithoutAccountInput>;
    connectOrCreate?: CurrencyCreateOrConnectWithoutAccountInput;
    upsert?: CurrencyUpsertWithoutAccountInput;
    disconnect?: CurrencyWhereInput | boolean;
    delete?: CurrencyWhereInput | boolean;
    connect?: CurrencyWhereUniqueInput;
    update?: XOR<
      XOR<CurrencyUpdateToOneWithWhereWithoutAccountInput, CurrencyUpdateWithoutAccountInput>,
      CurrencyUncheckedUpdateWithoutAccountInput
    >;
  };

  export type FileUpdateOneWithoutAccountNestedInput = {
    create?: XOR<FileCreateWithoutAccountInput, FileUncheckedCreateWithoutAccountInput>;
    connectOrCreate?: FileCreateOrConnectWithoutAccountInput;
    upsert?: FileUpsertWithoutAccountInput;
    disconnect?: FileWhereInput | boolean;
    delete?: FileWhereInput | boolean;
    connect?: FileWhereUniqueInput;
    update?: XOR<
      XOR<FileUpdateToOneWithWhereWithoutAccountInput, FileUpdateWithoutAccountInput>,
      FileUncheckedUpdateWithoutAccountInput
    >;
  };

  export type AccountContactUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<AccountContactCreateWithoutAccountInput, AccountContactUncheckedCreateWithoutAccountInput>
      | AccountContactCreateWithoutAccountInput[]
      | AccountContactUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountContactCreateOrConnectWithoutAccountInput
      | AccountContactCreateOrConnectWithoutAccountInput[];
    upsert?:
      | AccountContactUpsertWithWhereUniqueWithoutAccountInput
      | AccountContactUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: AccountContactCreateManyAccountInputEnvelope;
    set?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    disconnect?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    delete?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    connect?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    update?:
      | AccountContactUpdateWithWhereUniqueWithoutAccountInput
      | AccountContactUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | AccountContactUpdateManyWithWhereWithoutAccountInput
      | AccountContactUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: AccountContactScalarWhereInput | AccountContactScalarWhereInput[];
  };

  export type AccountSubscriptionUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<AccountSubscriptionCreateWithoutAccountInput, AccountSubscriptionUncheckedCreateWithoutAccountInput>
      | AccountSubscriptionCreateWithoutAccountInput[]
      | AccountSubscriptionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutAccountInput
      | AccountSubscriptionCreateOrConnectWithoutAccountInput[];
    upsert?:
      | AccountSubscriptionUpsertWithWhereUniqueWithoutAccountInput
      | AccountSubscriptionUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: AccountSubscriptionCreateManyAccountInputEnvelope;
    set?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    disconnect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    delete?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    update?:
      | AccountSubscriptionUpdateWithWhereUniqueWithoutAccountInput
      | AccountSubscriptionUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | AccountSubscriptionUpdateManyWithWhereWithoutAccountInput
      | AccountSubscriptionUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: AccountSubscriptionScalarWhereInput | AccountSubscriptionScalarWhereInput[];
  };

  export type AccountUserUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<AccountUserCreateWithoutAccountInput, AccountUserUncheckedCreateWithoutAccountInput>
      | AccountUserCreateWithoutAccountInput[]
      | AccountUserUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: AccountUserCreateOrConnectWithoutAccountInput | AccountUserCreateOrConnectWithoutAccountInput[];
    upsert?:
      | AccountUserUpsertWithWhereUniqueWithoutAccountInput
      | AccountUserUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: AccountUserCreateManyAccountInputEnvelope;
    set?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    disconnect?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    delete?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    connect?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    update?:
      | AccountUserUpdateWithWhereUniqueWithoutAccountInput
      | AccountUserUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | AccountUserUpdateManyWithWhereWithoutAccountInput
      | AccountUserUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: AccountUserScalarWhereInput | AccountUserScalarWhereInput[];
  };

  export type ProductionCompanyUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutAccountInput, ProductionCompanyUncheckedCreateWithoutAccountInput>
      | ProductionCompanyCreateWithoutAccountInput[]
      | ProductionCompanyUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutAccountInput
      | ProductionCompanyCreateOrConnectWithoutAccountInput[];
    upsert?:
      | ProductionCompanyUpsertWithWhereUniqueWithoutAccountInput
      | ProductionCompanyUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: ProductionCompanyCreateManyAccountInputEnvelope;
    set?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    disconnect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    delete?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    update?:
      | ProductionCompanyUpdateWithWhereUniqueWithoutAccountInput
      | ProductionCompanyUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | ProductionCompanyUpdateManyWithWhereWithoutAccountInput
      | ProductionCompanyUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: ProductionCompanyScalarWhereInput | ProductionCompanyScalarWhereInput[];
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type AccountContactUncheckedUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<AccountContactCreateWithoutAccountInput, AccountContactUncheckedCreateWithoutAccountInput>
      | AccountContactCreateWithoutAccountInput[]
      | AccountContactUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountContactCreateOrConnectWithoutAccountInput
      | AccountContactCreateOrConnectWithoutAccountInput[];
    upsert?:
      | AccountContactUpsertWithWhereUniqueWithoutAccountInput
      | AccountContactUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: AccountContactCreateManyAccountInputEnvelope;
    set?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    disconnect?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    delete?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    connect?: AccountContactWhereUniqueInput | AccountContactWhereUniqueInput[];
    update?:
      | AccountContactUpdateWithWhereUniqueWithoutAccountInput
      | AccountContactUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | AccountContactUpdateManyWithWhereWithoutAccountInput
      | AccountContactUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: AccountContactScalarWhereInput | AccountContactScalarWhereInput[];
  };

  export type AccountSubscriptionUncheckedUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<AccountSubscriptionCreateWithoutAccountInput, AccountSubscriptionUncheckedCreateWithoutAccountInput>
      | AccountSubscriptionCreateWithoutAccountInput[]
      | AccountSubscriptionUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutAccountInput
      | AccountSubscriptionCreateOrConnectWithoutAccountInput[];
    upsert?:
      | AccountSubscriptionUpsertWithWhereUniqueWithoutAccountInput
      | AccountSubscriptionUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: AccountSubscriptionCreateManyAccountInputEnvelope;
    set?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    disconnect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    delete?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    update?:
      | AccountSubscriptionUpdateWithWhereUniqueWithoutAccountInput
      | AccountSubscriptionUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | AccountSubscriptionUpdateManyWithWhereWithoutAccountInput
      | AccountSubscriptionUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: AccountSubscriptionScalarWhereInput | AccountSubscriptionScalarWhereInput[];
  };

  export type AccountUserUncheckedUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<AccountUserCreateWithoutAccountInput, AccountUserUncheckedCreateWithoutAccountInput>
      | AccountUserCreateWithoutAccountInput[]
      | AccountUserUncheckedCreateWithoutAccountInput[];
    connectOrCreate?: AccountUserCreateOrConnectWithoutAccountInput | AccountUserCreateOrConnectWithoutAccountInput[];
    upsert?:
      | AccountUserUpsertWithWhereUniqueWithoutAccountInput
      | AccountUserUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: AccountUserCreateManyAccountInputEnvelope;
    set?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    disconnect?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    delete?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    connect?: AccountUserWhereUniqueInput | AccountUserWhereUniqueInput[];
    update?:
      | AccountUserUpdateWithWhereUniqueWithoutAccountInput
      | AccountUserUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | AccountUserUpdateManyWithWhereWithoutAccountInput
      | AccountUserUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: AccountUserScalarWhereInput | AccountUserScalarWhereInput[];
  };

  export type ProductionCompanyUncheckedUpdateManyWithoutAccountNestedInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutAccountInput, ProductionCompanyUncheckedCreateWithoutAccountInput>
      | ProductionCompanyCreateWithoutAccountInput[]
      | ProductionCompanyUncheckedCreateWithoutAccountInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutAccountInput
      | ProductionCompanyCreateOrConnectWithoutAccountInput[];
    upsert?:
      | ProductionCompanyUpsertWithWhereUniqueWithoutAccountInput
      | ProductionCompanyUpsertWithWhereUniqueWithoutAccountInput[];
    createMany?: ProductionCompanyCreateManyAccountInputEnvelope;
    set?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    disconnect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    delete?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    update?:
      | ProductionCompanyUpdateWithWhereUniqueWithoutAccountInput
      | ProductionCompanyUpdateWithWhereUniqueWithoutAccountInput[];
    updateMany?:
      | ProductionCompanyUpdateManyWithWhereWithoutAccountInput
      | ProductionCompanyUpdateManyWithWhereWithoutAccountInput[];
    deleteMany?: ProductionCompanyScalarWhereInput | ProductionCompanyScalarWhereInput[];
  };

  export type AccountCreateNestedOneWithoutAccountContactInput = {
    create?: XOR<AccountCreateWithoutAccountContactInput, AccountUncheckedCreateWithoutAccountContactInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutAccountContactInput;
    connect?: AccountWhereUniqueInput;
  };

  export type AccountUpdateOneRequiredWithoutAccountContactNestedInput = {
    create?: XOR<AccountCreateWithoutAccountContactInput, AccountUncheckedCreateWithoutAccountContactInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutAccountContactInput;
    upsert?: AccountUpsertWithoutAccountContactInput;
    connect?: AccountWhereUniqueInput;
    update?: XOR<
      XOR<AccountUpdateToOneWithWhereWithoutAccountContactInput, AccountUpdateWithoutAccountContactInput>,
      AccountUncheckedUpdateWithoutAccountContactInput
    >;
  };

  export type AccountCreateNestedOneWithoutAccountSubscriptionInput = {
    create?: XOR<AccountCreateWithoutAccountSubscriptionInput, AccountUncheckedCreateWithoutAccountSubscriptionInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutAccountSubscriptionInput;
    connect?: AccountWhereUniqueInput;
  };

  export type SubscriptionPlanCreateNestedOneWithoutAccountSubscriptionInput = {
    create?: XOR<
      SubscriptionPlanCreateWithoutAccountSubscriptionInput,
      SubscriptionPlanUncheckedCreateWithoutAccountSubscriptionInput
    >;
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutAccountSubscriptionInput;
    connect?: SubscriptionPlanWhereUniqueInput;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
  };

  export type AccountUpdateOneRequiredWithoutAccountSubscriptionNestedInput = {
    create?: XOR<AccountCreateWithoutAccountSubscriptionInput, AccountUncheckedCreateWithoutAccountSubscriptionInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutAccountSubscriptionInput;
    upsert?: AccountUpsertWithoutAccountSubscriptionInput;
    connect?: AccountWhereUniqueInput;
    update?: XOR<
      XOR<AccountUpdateToOneWithWhereWithoutAccountSubscriptionInput, AccountUpdateWithoutAccountSubscriptionInput>,
      AccountUncheckedUpdateWithoutAccountSubscriptionInput
    >;
  };

  export type SubscriptionPlanUpdateOneRequiredWithoutAccountSubscriptionNestedInput = {
    create?: XOR<
      SubscriptionPlanCreateWithoutAccountSubscriptionInput,
      SubscriptionPlanUncheckedCreateWithoutAccountSubscriptionInput
    >;
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutAccountSubscriptionInput;
    upsert?: SubscriptionPlanUpsertWithoutAccountSubscriptionInput;
    connect?: SubscriptionPlanWhereUniqueInput;
    update?: XOR<
      XOR<
        SubscriptionPlanUpdateToOneWithWhereWithoutAccountSubscriptionInput,
        SubscriptionPlanUpdateWithoutAccountSubscriptionInput
      >,
      SubscriptionPlanUncheckedUpdateWithoutAccountSubscriptionInput
    >;
  };

  export type AccountCreateNestedOneWithoutAccountUserInput = {
    create?: XOR<AccountCreateWithoutAccountUserInput, AccountUncheckedCreateWithoutAccountUserInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutAccountUserInput;
    connect?: AccountWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutAccountUserInput = {
    create?: XOR<UserCreateWithoutAccountUserInput, UserUncheckedCreateWithoutAccountUserInput>;
    connectOrCreate?: UserCreateOrConnectWithoutAccountUserInput;
    connect?: UserWhereUniqueInput;
  };

  export type AccountUserPermissionCreateNestedManyWithoutAccountUserInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutAccountUserInput,
          AccountUserPermissionUncheckedCreateWithoutAccountUserInput
        >
      | AccountUserPermissionCreateWithoutAccountUserInput[]
      | AccountUserPermissionUncheckedCreateWithoutAccountUserInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput[];
    createMany?: AccountUserPermissionCreateManyAccountUserInputEnvelope;
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
  };

  export type AccountUserPermissionUncheckedCreateNestedManyWithoutAccountUserInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutAccountUserInput,
          AccountUserPermissionUncheckedCreateWithoutAccountUserInput
        >
      | AccountUserPermissionCreateWithoutAccountUserInput[]
      | AccountUserPermissionUncheckedCreateWithoutAccountUserInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput[];
    createMany?: AccountUserPermissionCreateManyAccountUserInputEnvelope;
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type AccountUpdateOneRequiredWithoutAccountUserNestedInput = {
    create?: XOR<AccountCreateWithoutAccountUserInput, AccountUncheckedCreateWithoutAccountUserInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutAccountUserInput;
    upsert?: AccountUpsertWithoutAccountUserInput;
    connect?: AccountWhereUniqueInput;
    update?: XOR<
      XOR<AccountUpdateToOneWithWhereWithoutAccountUserInput, AccountUpdateWithoutAccountUserInput>,
      AccountUncheckedUpdateWithoutAccountUserInput
    >;
  };

  export type UserUpdateOneRequiredWithoutAccountUserNestedInput = {
    create?: XOR<UserCreateWithoutAccountUserInput, UserUncheckedCreateWithoutAccountUserInput>;
    connectOrCreate?: UserCreateOrConnectWithoutAccountUserInput;
    upsert?: UserUpsertWithoutAccountUserInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutAccountUserInput, UserUpdateWithoutAccountUserInput>,
      UserUncheckedUpdateWithoutAccountUserInput
    >;
  };

  export type AccountUserPermissionUpdateManyWithoutAccountUserNestedInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutAccountUserInput,
          AccountUserPermissionUncheckedCreateWithoutAccountUserInput
        >
      | AccountUserPermissionCreateWithoutAccountUserInput[]
      | AccountUserPermissionUncheckedCreateWithoutAccountUserInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput[];
    upsert?:
      | AccountUserPermissionUpsertWithWhereUniqueWithoutAccountUserInput
      | AccountUserPermissionUpsertWithWhereUniqueWithoutAccountUserInput[];
    createMany?: AccountUserPermissionCreateManyAccountUserInputEnvelope;
    set?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    disconnect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    delete?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    update?:
      | AccountUserPermissionUpdateWithWhereUniqueWithoutAccountUserInput
      | AccountUserPermissionUpdateWithWhereUniqueWithoutAccountUserInput[];
    updateMany?:
      | AccountUserPermissionUpdateManyWithWhereWithoutAccountUserInput
      | AccountUserPermissionUpdateManyWithWhereWithoutAccountUserInput[];
    deleteMany?: AccountUserPermissionScalarWhereInput | AccountUserPermissionScalarWhereInput[];
  };

  export type AccountUserPermissionUncheckedUpdateManyWithoutAccountUserNestedInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutAccountUserInput,
          AccountUserPermissionUncheckedCreateWithoutAccountUserInput
        >
      | AccountUserPermissionCreateWithoutAccountUserInput[]
      | AccountUserPermissionUncheckedCreateWithoutAccountUserInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput
      | AccountUserPermissionCreateOrConnectWithoutAccountUserInput[];
    upsert?:
      | AccountUserPermissionUpsertWithWhereUniqueWithoutAccountUserInput
      | AccountUserPermissionUpsertWithWhereUniqueWithoutAccountUserInput[];
    createMany?: AccountUserPermissionCreateManyAccountUserInputEnvelope;
    set?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    disconnect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    delete?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    update?:
      | AccountUserPermissionUpdateWithWhereUniqueWithoutAccountUserInput
      | AccountUserPermissionUpdateWithWhereUniqueWithoutAccountUserInput[];
    updateMany?:
      | AccountUserPermissionUpdateManyWithWhereWithoutAccountUserInput
      | AccountUserPermissionUpdateManyWithWhereWithoutAccountUserInput[];
    deleteMany?: AccountUserPermissionScalarWhereInput | AccountUserPermissionScalarWhereInput[];
  };

  export type AccountUserCreateNestedOneWithoutAccountUserPermissionInput = {
    create?: XOR<
      AccountUserCreateWithoutAccountUserPermissionInput,
      AccountUserUncheckedCreateWithoutAccountUserPermissionInput
    >;
    connectOrCreate?: AccountUserCreateOrConnectWithoutAccountUserPermissionInput;
    connect?: AccountUserWhereUniqueInput;
  };

  export type PermissionCreateNestedOneWithoutAccountUserPermissionInput = {
    create?: XOR<
      PermissionCreateWithoutAccountUserPermissionInput,
      PermissionUncheckedCreateWithoutAccountUserPermissionInput
    >;
    connectOrCreate?: PermissionCreateOrConnectWithoutAccountUserPermissionInput;
    connect?: PermissionWhereUniqueInput;
  };

  export type AccountUserUpdateOneRequiredWithoutAccountUserPermissionNestedInput = {
    create?: XOR<
      AccountUserCreateWithoutAccountUserPermissionInput,
      AccountUserUncheckedCreateWithoutAccountUserPermissionInput
    >;
    connectOrCreate?: AccountUserCreateOrConnectWithoutAccountUserPermissionInput;
    upsert?: AccountUserUpsertWithoutAccountUserPermissionInput;
    connect?: AccountUserWhereUniqueInput;
    update?: XOR<
      XOR<
        AccountUserUpdateToOneWithWhereWithoutAccountUserPermissionInput,
        AccountUserUpdateWithoutAccountUserPermissionInput
      >,
      AccountUserUncheckedUpdateWithoutAccountUserPermissionInput
    >;
  };

  export type PermissionUpdateOneRequiredWithoutAccountUserPermissionNestedInput = {
    create?: XOR<
      PermissionCreateWithoutAccountUserPermissionInput,
      PermissionUncheckedCreateWithoutAccountUserPermissionInput
    >;
    connectOrCreate?: PermissionCreateOrConnectWithoutAccountUserPermissionInput;
    upsert?: PermissionUpsertWithoutAccountUserPermissionInput;
    connect?: PermissionWhereUniqueInput;
    update?: XOR<
      XOR<
        PermissionUpdateToOneWithWhereWithoutAccountUserPermissionInput,
        PermissionUpdateWithoutAccountUserPermissionInput
      >,
      PermissionUncheckedUpdateWithoutAccountUserPermissionInput
    >;
  };

  export type AccountCreateNestedManyWithoutCurrencyInput = {
    create?:
      | XOR<AccountCreateWithoutCurrencyInput, AccountUncheckedCreateWithoutCurrencyInput>
      | AccountCreateWithoutCurrencyInput[]
      | AccountUncheckedCreateWithoutCurrencyInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutCurrencyInput | AccountCreateOrConnectWithoutCurrencyInput[];
    createMany?: AccountCreateManyCurrencyInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };

  export type AccountUncheckedCreateNestedManyWithoutCurrencyInput = {
    create?:
      | XOR<AccountCreateWithoutCurrencyInput, AccountUncheckedCreateWithoutCurrencyInput>
      | AccountCreateWithoutCurrencyInput[]
      | AccountUncheckedCreateWithoutCurrencyInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutCurrencyInput | AccountCreateOrConnectWithoutCurrencyInput[];
    createMany?: AccountCreateManyCurrencyInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };

  export type AccountUpdateManyWithoutCurrencyNestedInput = {
    create?:
      | XOR<AccountCreateWithoutCurrencyInput, AccountUncheckedCreateWithoutCurrencyInput>
      | AccountCreateWithoutCurrencyInput[]
      | AccountUncheckedCreateWithoutCurrencyInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutCurrencyInput | AccountCreateOrConnectWithoutCurrencyInput[];
    upsert?: AccountUpsertWithWhereUniqueWithoutCurrencyInput | AccountUpsertWithWhereUniqueWithoutCurrencyInput[];
    createMany?: AccountCreateManyCurrencyInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?: AccountUpdateWithWhereUniqueWithoutCurrencyInput | AccountUpdateWithWhereUniqueWithoutCurrencyInput[];
    updateMany?: AccountUpdateManyWithWhereWithoutCurrencyInput | AccountUpdateManyWithWhereWithoutCurrencyInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };

  export type AccountUncheckedUpdateManyWithoutCurrencyNestedInput = {
    create?:
      | XOR<AccountCreateWithoutCurrencyInput, AccountUncheckedCreateWithoutCurrencyInput>
      | AccountCreateWithoutCurrencyInput[]
      | AccountUncheckedCreateWithoutCurrencyInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutCurrencyInput | AccountCreateOrConnectWithoutCurrencyInput[];
    upsert?: AccountUpsertWithWhereUniqueWithoutCurrencyInput | AccountUpsertWithWhereUniqueWithoutCurrencyInput[];
    createMany?: AccountCreateManyCurrencyInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?: AccountUpdateWithWhereUniqueWithoutCurrencyInput | AccountUpdateWithWhereUniqueWithoutCurrencyInput[];
    updateMany?: AccountUpdateManyWithWhereWithoutCurrencyInput | AccountUpdateManyWithWhereWithoutCurrencyInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };

  export type AccountCreateNestedManyWithoutFileInput = {
    create?:
      | XOR<AccountCreateWithoutFileInput, AccountUncheckedCreateWithoutFileInput>
      | AccountCreateWithoutFileInput[]
      | AccountUncheckedCreateWithoutFileInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutFileInput | AccountCreateOrConnectWithoutFileInput[];
    createMany?: AccountCreateManyFileInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };

  export type UserCreateNestedOneWithoutFileInput = {
    create?: XOR<UserCreateWithoutFileInput, UserUncheckedCreateWithoutFileInput>;
    connectOrCreate?: UserCreateOrConnectWithoutFileInput;
    connect?: UserWhereUniqueInput;
  };

  export type ProductionCompanyCreateNestedManyWithoutFileInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutFileInput, ProductionCompanyUncheckedCreateWithoutFileInput>
      | ProductionCompanyCreateWithoutFileInput[]
      | ProductionCompanyUncheckedCreateWithoutFileInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutFileInput
      | ProductionCompanyCreateOrConnectWithoutFileInput[];
    createMany?: ProductionCompanyCreateManyFileInputEnvelope;
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
  };

  export type AccountUncheckedCreateNestedManyWithoutFileInput = {
    create?:
      | XOR<AccountCreateWithoutFileInput, AccountUncheckedCreateWithoutFileInput>
      | AccountCreateWithoutFileInput[]
      | AccountUncheckedCreateWithoutFileInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutFileInput | AccountCreateOrConnectWithoutFileInput[];
    createMany?: AccountCreateManyFileInputEnvelope;
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
  };

  export type ProductionCompanyUncheckedCreateNestedManyWithoutFileInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutFileInput, ProductionCompanyUncheckedCreateWithoutFileInput>
      | ProductionCompanyCreateWithoutFileInput[]
      | ProductionCompanyUncheckedCreateWithoutFileInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutFileInput
      | ProductionCompanyCreateOrConnectWithoutFileInput[];
    createMany?: ProductionCompanyCreateManyFileInputEnvelope;
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
  };

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
  };

  export type AccountUpdateManyWithoutFileNestedInput = {
    create?:
      | XOR<AccountCreateWithoutFileInput, AccountUncheckedCreateWithoutFileInput>
      | AccountCreateWithoutFileInput[]
      | AccountUncheckedCreateWithoutFileInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutFileInput | AccountCreateOrConnectWithoutFileInput[];
    upsert?: AccountUpsertWithWhereUniqueWithoutFileInput | AccountUpsertWithWhereUniqueWithoutFileInput[];
    createMany?: AccountCreateManyFileInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?: AccountUpdateWithWhereUniqueWithoutFileInput | AccountUpdateWithWhereUniqueWithoutFileInput[];
    updateMany?: AccountUpdateManyWithWhereWithoutFileInput | AccountUpdateManyWithWhereWithoutFileInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };

  export type UserUpdateOneRequiredWithoutFileNestedInput = {
    create?: XOR<UserCreateWithoutFileInput, UserUncheckedCreateWithoutFileInput>;
    connectOrCreate?: UserCreateOrConnectWithoutFileInput;
    upsert?: UserUpsertWithoutFileInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutFileInput, UserUpdateWithoutFileInput>,
      UserUncheckedUpdateWithoutFileInput
    >;
  };

  export type ProductionCompanyUpdateManyWithoutFileNestedInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutFileInput, ProductionCompanyUncheckedCreateWithoutFileInput>
      | ProductionCompanyCreateWithoutFileInput[]
      | ProductionCompanyUncheckedCreateWithoutFileInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutFileInput
      | ProductionCompanyCreateOrConnectWithoutFileInput[];
    upsert?:
      | ProductionCompanyUpsertWithWhereUniqueWithoutFileInput
      | ProductionCompanyUpsertWithWhereUniqueWithoutFileInput[];
    createMany?: ProductionCompanyCreateManyFileInputEnvelope;
    set?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    disconnect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    delete?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    update?:
      | ProductionCompanyUpdateWithWhereUniqueWithoutFileInput
      | ProductionCompanyUpdateWithWhereUniqueWithoutFileInput[];
    updateMany?:
      | ProductionCompanyUpdateManyWithWhereWithoutFileInput
      | ProductionCompanyUpdateManyWithWhereWithoutFileInput[];
    deleteMany?: ProductionCompanyScalarWhereInput | ProductionCompanyScalarWhereInput[];
  };

  export type AccountUncheckedUpdateManyWithoutFileNestedInput = {
    create?:
      | XOR<AccountCreateWithoutFileInput, AccountUncheckedCreateWithoutFileInput>
      | AccountCreateWithoutFileInput[]
      | AccountUncheckedCreateWithoutFileInput[];
    connectOrCreate?: AccountCreateOrConnectWithoutFileInput | AccountCreateOrConnectWithoutFileInput[];
    upsert?: AccountUpsertWithWhereUniqueWithoutFileInput | AccountUpsertWithWhereUniqueWithoutFileInput[];
    createMany?: AccountCreateManyFileInputEnvelope;
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[];
    update?: AccountUpdateWithWhereUniqueWithoutFileInput | AccountUpdateWithWhereUniqueWithoutFileInput[];
    updateMany?: AccountUpdateManyWithWhereWithoutFileInput | AccountUpdateManyWithWhereWithoutFileInput[];
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[];
  };

  export type ProductionCompanyUncheckedUpdateManyWithoutFileNestedInput = {
    create?:
      | XOR<ProductionCompanyCreateWithoutFileInput, ProductionCompanyUncheckedCreateWithoutFileInput>
      | ProductionCompanyCreateWithoutFileInput[]
      | ProductionCompanyUncheckedCreateWithoutFileInput[];
    connectOrCreate?:
      | ProductionCompanyCreateOrConnectWithoutFileInput
      | ProductionCompanyCreateOrConnectWithoutFileInput[];
    upsert?:
      | ProductionCompanyUpsertWithWhereUniqueWithoutFileInput
      | ProductionCompanyUpsertWithWhereUniqueWithoutFileInput[];
    createMany?: ProductionCompanyCreateManyFileInputEnvelope;
    set?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    disconnect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    delete?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    connect?: ProductionCompanyWhereUniqueInput | ProductionCompanyWhereUniqueInput[];
    update?:
      | ProductionCompanyUpdateWithWhereUniqueWithoutFileInput
      | ProductionCompanyUpdateWithWhereUniqueWithoutFileInput[];
    updateMany?:
      | ProductionCompanyUpdateManyWithWhereWithoutFileInput
      | ProductionCompanyUpdateManyWithWhereWithoutFileInput[];
    deleteMany?: ProductionCompanyScalarWhereInput | ProductionCompanyScalarWhereInput[];
  };

  export type AccountUserPermissionCreateNestedManyWithoutPermissionInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutPermissionInput,
          AccountUserPermissionUncheckedCreateWithoutPermissionInput
        >
      | AccountUserPermissionCreateWithoutPermissionInput[]
      | AccountUserPermissionUncheckedCreateWithoutPermissionInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput[];
    createMany?: AccountUserPermissionCreateManyPermissionInputEnvelope;
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
  };

  export type AccountUserPermissionUncheckedCreateNestedManyWithoutPermissionInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutPermissionInput,
          AccountUserPermissionUncheckedCreateWithoutPermissionInput
        >
      | AccountUserPermissionCreateWithoutPermissionInput[]
      | AccountUserPermissionUncheckedCreateWithoutPermissionInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput[];
    createMany?: AccountUserPermissionCreateManyPermissionInputEnvelope;
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
  };

  export type AccountUserPermissionUpdateManyWithoutPermissionNestedInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutPermissionInput,
          AccountUserPermissionUncheckedCreateWithoutPermissionInput
        >
      | AccountUserPermissionCreateWithoutPermissionInput[]
      | AccountUserPermissionUncheckedCreateWithoutPermissionInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput[];
    upsert?:
      | AccountUserPermissionUpsertWithWhereUniqueWithoutPermissionInput
      | AccountUserPermissionUpsertWithWhereUniqueWithoutPermissionInput[];
    createMany?: AccountUserPermissionCreateManyPermissionInputEnvelope;
    set?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    disconnect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    delete?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    update?:
      | AccountUserPermissionUpdateWithWhereUniqueWithoutPermissionInput
      | AccountUserPermissionUpdateWithWhereUniqueWithoutPermissionInput[];
    updateMany?:
      | AccountUserPermissionUpdateManyWithWhereWithoutPermissionInput
      | AccountUserPermissionUpdateManyWithWhereWithoutPermissionInput[];
    deleteMany?: AccountUserPermissionScalarWhereInput | AccountUserPermissionScalarWhereInput[];
  };

  export type AccountUserPermissionUncheckedUpdateManyWithoutPermissionNestedInput = {
    create?:
      | XOR<
          AccountUserPermissionCreateWithoutPermissionInput,
          AccountUserPermissionUncheckedCreateWithoutPermissionInput
        >
      | AccountUserPermissionCreateWithoutPermissionInput[]
      | AccountUserPermissionUncheckedCreateWithoutPermissionInput[];
    connectOrCreate?:
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput
      | AccountUserPermissionCreateOrConnectWithoutPermissionInput[];
    upsert?:
      | AccountUserPermissionUpsertWithWhereUniqueWithoutPermissionInput
      | AccountUserPermissionUpsertWithWhereUniqueWithoutPermissionInput[];
    createMany?: AccountUserPermissionCreateManyPermissionInputEnvelope;
    set?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    disconnect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    delete?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    connect?: AccountUserPermissionWhereUniqueInput | AccountUserPermissionWhereUniqueInput[];
    update?:
      | AccountUserPermissionUpdateWithWhereUniqueWithoutPermissionInput
      | AccountUserPermissionUpdateWithWhereUniqueWithoutPermissionInput[];
    updateMany?:
      | AccountUserPermissionUpdateManyWithWhereWithoutPermissionInput
      | AccountUserPermissionUpdateManyWithWhereWithoutPermissionInput[];
    deleteMany?: AccountUserPermissionScalarWhereInput | AccountUserPermissionScalarWhereInput[];
  };

  export type AccountCreateNestedOneWithoutProductionCompanyInput = {
    create?: XOR<AccountCreateWithoutProductionCompanyInput, AccountUncheckedCreateWithoutProductionCompanyInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutProductionCompanyInput;
    connect?: AccountWhereUniqueInput;
  };

  export type FileCreateNestedOneWithoutProductionCompanyInput = {
    create?: XOR<FileCreateWithoutProductionCompanyInput, FileUncheckedCreateWithoutProductionCompanyInput>;
    connectOrCreate?: FileCreateOrConnectWithoutProductionCompanyInput;
    connect?: FileWhereUniqueInput;
  };

  export type AccountUpdateOneRequiredWithoutProductionCompanyNestedInput = {
    create?: XOR<AccountCreateWithoutProductionCompanyInput, AccountUncheckedCreateWithoutProductionCompanyInput>;
    connectOrCreate?: AccountCreateOrConnectWithoutProductionCompanyInput;
    upsert?: AccountUpsertWithoutProductionCompanyInput;
    connect?: AccountWhereUniqueInput;
    update?: XOR<
      XOR<AccountUpdateToOneWithWhereWithoutProductionCompanyInput, AccountUpdateWithoutProductionCompanyInput>,
      AccountUncheckedUpdateWithoutProductionCompanyInput
    >;
  };

  export type FileUpdateOneWithoutProductionCompanyNestedInput = {
    create?: XOR<FileCreateWithoutProductionCompanyInput, FileUncheckedCreateWithoutProductionCompanyInput>;
    connectOrCreate?: FileCreateOrConnectWithoutProductionCompanyInput;
    upsert?: FileUpsertWithoutProductionCompanyInput;
    disconnect?: FileWhereInput | boolean;
    delete?: FileWhereInput | boolean;
    connect?: FileWhereUniqueInput;
    update?: XOR<
      XOR<FileUpdateToOneWithWhereWithoutProductionCompanyInput, FileUpdateWithoutProductionCompanyInput>,
      FileUncheckedUpdateWithoutProductionCompanyInput
    >;
  };

  export type AccountSubscriptionCreateNestedManyWithoutSubscriptionPlanInput = {
    create?:
      | XOR<
          AccountSubscriptionCreateWithoutSubscriptionPlanInput,
          AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput
        >
      | AccountSubscriptionCreateWithoutSubscriptionPlanInput[]
      | AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput[];
    createMany?: AccountSubscriptionCreateManySubscriptionPlanInputEnvelope;
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
  };

  export type AccountSubscriptionUncheckedCreateNestedManyWithoutSubscriptionPlanInput = {
    create?:
      | XOR<
          AccountSubscriptionCreateWithoutSubscriptionPlanInput,
          AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput
        >
      | AccountSubscriptionCreateWithoutSubscriptionPlanInput[]
      | AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput[];
    createMany?: AccountSubscriptionCreateManySubscriptionPlanInputEnvelope;
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
  };

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string;
    increment?: Decimal | DecimalJsLike | number | string;
    decrement?: Decimal | DecimalJsLike | number | string;
    multiply?: Decimal | DecimalJsLike | number | string;
    divide?: Decimal | DecimalJsLike | number | string;
  };

  export type AccountSubscriptionUpdateManyWithoutSubscriptionPlanNestedInput = {
    create?:
      | XOR<
          AccountSubscriptionCreateWithoutSubscriptionPlanInput,
          AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput
        >
      | AccountSubscriptionCreateWithoutSubscriptionPlanInput[]
      | AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput[];
    upsert?:
      | AccountSubscriptionUpsertWithWhereUniqueWithoutSubscriptionPlanInput
      | AccountSubscriptionUpsertWithWhereUniqueWithoutSubscriptionPlanInput[];
    createMany?: AccountSubscriptionCreateManySubscriptionPlanInputEnvelope;
    set?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    disconnect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    delete?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    update?:
      | AccountSubscriptionUpdateWithWhereUniqueWithoutSubscriptionPlanInput
      | AccountSubscriptionUpdateWithWhereUniqueWithoutSubscriptionPlanInput[];
    updateMany?:
      | AccountSubscriptionUpdateManyWithWhereWithoutSubscriptionPlanInput
      | AccountSubscriptionUpdateManyWithWhereWithoutSubscriptionPlanInput[];
    deleteMany?: AccountSubscriptionScalarWhereInput | AccountSubscriptionScalarWhereInput[];
  };

  export type AccountSubscriptionUncheckedUpdateManyWithoutSubscriptionPlanNestedInput = {
    create?:
      | XOR<
          AccountSubscriptionCreateWithoutSubscriptionPlanInput,
          AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput
        >
      | AccountSubscriptionCreateWithoutSubscriptionPlanInput[]
      | AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput[];
    connectOrCreate?:
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput
      | AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput[];
    upsert?:
      | AccountSubscriptionUpsertWithWhereUniqueWithoutSubscriptionPlanInput
      | AccountSubscriptionUpsertWithWhereUniqueWithoutSubscriptionPlanInput[];
    createMany?: AccountSubscriptionCreateManySubscriptionPlanInputEnvelope;
    set?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    disconnect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    delete?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    connect?: AccountSubscriptionWhereUniqueInput | AccountSubscriptionWhereUniqueInput[];
    update?:
      | AccountSubscriptionUpdateWithWhereUniqueWithoutSubscriptionPlanInput
      | AccountSubscriptionUpdateWithWhereUniqueWithoutSubscriptionPlanInput[];
    updateMany?:
      | AccountSubscriptionUpdateManyWithWhereWithoutSubscriptionPlanInput
      | AccountSubscriptionUpdateManyWithWhereWithoutSubscriptionPlanInput[];
    deleteMany?: AccountSubscriptionScalarWhereInput | AccountSubscriptionScalarWhereInput[];
  };

  export type AccountUserCreateNestedOneWithoutUserInput = {
    create?: XOR<AccountUserCreateWithoutUserInput, AccountUserUncheckedCreateWithoutUserInput>;
    connectOrCreate?: AccountUserCreateOrConnectWithoutUserInput;
    connect?: AccountUserWhereUniqueInput;
  };

  export type FileCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
      | FileCreateWithoutUserInput[]
      | FileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[];
    createMany?: FileCreateManyUserInputEnvelope;
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[];
  };

  export type AccountUserUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<AccountUserCreateWithoutUserInput, AccountUserUncheckedCreateWithoutUserInput>;
    connectOrCreate?: AccountUserCreateOrConnectWithoutUserInput;
    connect?: AccountUserWhereUniqueInput;
  };

  export type FileUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
      | FileCreateWithoutUserInput[]
      | FileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[];
    createMany?: FileCreateManyUserInputEnvelope;
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[];
  };

  export type AccountUserUpdateOneWithoutUserNestedInput = {
    create?: XOR<AccountUserCreateWithoutUserInput, AccountUserUncheckedCreateWithoutUserInput>;
    connectOrCreate?: AccountUserCreateOrConnectWithoutUserInput;
    upsert?: AccountUserUpsertWithoutUserInput;
    disconnect?: AccountUserWhereInput | boolean;
    delete?: AccountUserWhereInput | boolean;
    connect?: AccountUserWhereUniqueInput;
    update?: XOR<
      XOR<AccountUserUpdateToOneWithWhereWithoutUserInput, AccountUserUpdateWithoutUserInput>,
      AccountUserUncheckedUpdateWithoutUserInput
    >;
  };

  export type FileUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
      | FileCreateWithoutUserInput[]
      | FileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[];
    upsert?: FileUpsertWithWhereUniqueWithoutUserInput | FileUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FileCreateManyUserInputEnvelope;
    set?: FileWhereUniqueInput | FileWhereUniqueInput[];
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[];
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[];
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[];
    update?: FileUpdateWithWhereUniqueWithoutUserInput | FileUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: FileUpdateManyWithWhereWithoutUserInput | FileUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[];
  };

  export type AccountUserUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<AccountUserCreateWithoutUserInput, AccountUserUncheckedCreateWithoutUserInput>;
    connectOrCreate?: AccountUserCreateOrConnectWithoutUserInput;
    upsert?: AccountUserUpsertWithoutUserInput;
    disconnect?: AccountUserWhereInput | boolean;
    delete?: AccountUserWhereInput | boolean;
    connect?: AccountUserWhereUniqueInput;
    update?: XOR<
      XOR<AccountUserUpdateToOneWithWhereWithoutUserInput, AccountUserUpdateWithoutUserInput>,
      AccountUserUncheckedUpdateWithoutUserInput
    >;
  };

  export type FileUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
      | FileCreateWithoutUserInput[]
      | FileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[];
    upsert?: FileUpsertWithWhereUniqueWithoutUserInput | FileUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: FileCreateManyUserInputEnvelope;
    set?: FileWhereUniqueInput | FileWhereUniqueInput[];
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[];
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[];
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[];
    update?: FileUpdateWithWhereUniqueWithoutUserInput | FileUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: FileUpdateManyWithWhereWithoutUserInput | FileUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[];
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[];
    notIn?: number[];
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[];
    notIn?: string[];
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | null;
    notIn?: string[] | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | null;
    notIn?: number[] | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | null;
    notIn?: Date[] | string[] | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[];
    notIn?: Date[] | string[];
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null;
    in?: bigint[] | number[] | null;
    notIn?: bigint[] | number[] | null;
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null;
  };

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null;
    in?: bigint[] | number[] | null;
    notIn?: bigint[] | number[] | null;
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>;
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedBigIntNullableFilter<$PrismaModel>;
    _min?: NestedBigIntNullableFilter<$PrismaModel>;
    _max?: NestedBigIntNullableFilter<$PrismaModel>;
  };

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[];
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[];
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string;
  };

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    in?: Decimal[] | DecimalJsLike[] | number[] | string[];
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[];
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>;
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type CurrencyCreateWithoutAccountInput = {
    CurrencyCode: string;
    CurrencyName: string;
    CurrencySymbolUnicode?: string | null;
  };

  export type CurrencyUncheckedCreateWithoutAccountInput = {
    CurrencyCode: string;
    CurrencyName: string;
    CurrencySymbolUnicode?: string | null;
  };

  export type CurrencyCreateOrConnectWithoutAccountInput = {
    where: CurrencyWhereUniqueInput;
    create: XOR<CurrencyCreateWithoutAccountInput, CurrencyUncheckedCreateWithoutAccountInput>;
  };

  export type FileCreateWithoutAccountInput = {
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileSizeBytes?: bigint | number | null;
    User: UserCreateNestedOneWithoutFileInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutFileInput;
  };

  export type FileUncheckedCreateWithoutAccountInput = {
    FileId?: number;
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileUploadUserId: number;
    FileSizeBytes?: bigint | number | null;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutFileInput;
  };

  export type FileCreateOrConnectWithoutAccountInput = {
    where: FileWhereUniqueInput;
    create: XOR<FileCreateWithoutAccountInput, FileUncheckedCreateWithoutAccountInput>;
  };

  export type AccountContactCreateWithoutAccountInput = {
    AccContFirstName: string;
    AccContLastName?: string | null;
    AccContPhone?: string | null;
    AccContMainEmail?: string | null;
  };

  export type AccountContactUncheckedCreateWithoutAccountInput = {
    AccContId?: number;
    AccContFirstName: string;
    AccContLastName?: string | null;
    AccContPhone?: string | null;
    AccContMainEmail?: string | null;
  };

  export type AccountContactCreateOrConnectWithoutAccountInput = {
    where: AccountContactWhereUniqueInput;
    create: XOR<AccountContactCreateWithoutAccountInput, AccountContactUncheckedCreateWithoutAccountInput>;
  };

  export type AccountContactCreateManyAccountInputEnvelope = {
    data: AccountContactCreateManyAccountInput | AccountContactCreateManyAccountInput[];
    skipDuplicates?: boolean;
  };

  export type AccountSubscriptionCreateWithoutAccountInput = {
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
    SubscriptionPlan: SubscriptionPlanCreateNestedOneWithoutAccountSubscriptionInput;
  };

  export type AccountSubscriptionUncheckedCreateWithoutAccountInput = {
    AccSubId?: number;
    AccSubPlanId: number;
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
  };

  export type AccountSubscriptionCreateOrConnectWithoutAccountInput = {
    where: AccountSubscriptionWhereUniqueInput;
    create: XOR<AccountSubscriptionCreateWithoutAccountInput, AccountSubscriptionUncheckedCreateWithoutAccountInput>;
  };

  export type AccountSubscriptionCreateManyAccountInputEnvelope = {
    data: AccountSubscriptionCreateManyAccountInput | AccountSubscriptionCreateManyAccountInput[];
    skipDuplicates?: boolean;
  };

  export type AccountUserCreateWithoutAccountInput = {
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
    User: UserCreateNestedOneWithoutAccountUserInput;
    AccountUserPermission?: AccountUserPermissionCreateNestedManyWithoutAccountUserInput;
  };

  export type AccountUserUncheckedCreateWithoutAccountInput = {
    AccUserId?: number;
    AccUserUserId: number;
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
    AccountUserPermission?: AccountUserPermissionUncheckedCreateNestedManyWithoutAccountUserInput;
  };

  export type AccountUserCreateOrConnectWithoutAccountInput = {
    where: AccountUserWhereUniqueInput;
    create: XOR<AccountUserCreateWithoutAccountInput, AccountUserUncheckedCreateWithoutAccountInput>;
  };

  export type AccountUserCreateManyAccountInputEnvelope = {
    data: AccountUserCreateManyAccountInput | AccountUserCreateManyAccountInput[];
    skipDuplicates?: boolean;
  };

  export type ProductionCompanyCreateWithoutAccountInput = {
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
    File?: FileCreateNestedOneWithoutProductionCompanyInput;
  };

  export type ProductionCompanyUncheckedCreateWithoutAccountInput = {
    ProdCoId?: number;
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
    ProdCoLogoFileId?: number | null;
  };

  export type ProductionCompanyCreateOrConnectWithoutAccountInput = {
    where: ProductionCompanyWhereUniqueInput;
    create: XOR<ProductionCompanyCreateWithoutAccountInput, ProductionCompanyUncheckedCreateWithoutAccountInput>;
  };

  export type ProductionCompanyCreateManyAccountInputEnvelope = {
    data: ProductionCompanyCreateManyAccountInput | ProductionCompanyCreateManyAccountInput[];
    skipDuplicates?: boolean;
  };

  export type CurrencyUpsertWithoutAccountInput = {
    update: XOR<CurrencyUpdateWithoutAccountInput, CurrencyUncheckedUpdateWithoutAccountInput>;
    create: XOR<CurrencyCreateWithoutAccountInput, CurrencyUncheckedCreateWithoutAccountInput>;
    where?: CurrencyWhereInput;
  };

  export type CurrencyUpdateToOneWithWhereWithoutAccountInput = {
    where?: CurrencyWhereInput;
    data: XOR<CurrencyUpdateWithoutAccountInput, CurrencyUncheckedUpdateWithoutAccountInput>;
  };

  export type CurrencyUpdateWithoutAccountInput = {
    CurrencyCode?: StringFieldUpdateOperationsInput | string;
    CurrencyName?: StringFieldUpdateOperationsInput | string;
    CurrencySymbolUnicode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CurrencyUncheckedUpdateWithoutAccountInput = {
    CurrencyCode?: StringFieldUpdateOperationsInput | string;
    CurrencyName?: StringFieldUpdateOperationsInput | string;
    CurrencySymbolUnicode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type FileUpsertWithoutAccountInput = {
    update: XOR<FileUpdateWithoutAccountInput, FileUncheckedUpdateWithoutAccountInput>;
    create: XOR<FileCreateWithoutAccountInput, FileUncheckedCreateWithoutAccountInput>;
    where?: FileWhereInput;
  };

  export type FileUpdateToOneWithWhereWithoutAccountInput = {
    where?: FileWhereInput;
    data: XOR<FileUpdateWithoutAccountInput, FileUncheckedUpdateWithoutAccountInput>;
  };

  export type FileUpdateWithoutAccountInput = {
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    User?: UserUpdateOneRequiredWithoutFileNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutFileNestedInput;
  };

  export type FileUncheckedUpdateWithoutAccountInput = {
    FileId?: IntFieldUpdateOperationsInput | number;
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileUploadUserId?: IntFieldUpdateOperationsInput | number;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutFileNestedInput;
  };

  export type AccountContactUpsertWithWhereUniqueWithoutAccountInput = {
    where: AccountContactWhereUniqueInput;
    update: XOR<AccountContactUpdateWithoutAccountInput, AccountContactUncheckedUpdateWithoutAccountInput>;
    create: XOR<AccountContactCreateWithoutAccountInput, AccountContactUncheckedCreateWithoutAccountInput>;
  };

  export type AccountContactUpdateWithWhereUniqueWithoutAccountInput = {
    where: AccountContactWhereUniqueInput;
    data: XOR<AccountContactUpdateWithoutAccountInput, AccountContactUncheckedUpdateWithoutAccountInput>;
  };

  export type AccountContactUpdateManyWithWhereWithoutAccountInput = {
    where: AccountContactScalarWhereInput;
    data: XOR<AccountContactUpdateManyMutationInput, AccountContactUncheckedUpdateManyWithoutAccountInput>;
  };

  export type AccountContactScalarWhereInput = {
    AND?: AccountContactScalarWhereInput | AccountContactScalarWhereInput[];
    OR?: AccountContactScalarWhereInput[];
    NOT?: AccountContactScalarWhereInput | AccountContactScalarWhereInput[];
    AccContId?: IntFilter<'AccountContact'> | number;
    AccContAccountId?: IntFilter<'AccountContact'> | number;
    AccContFirstName?: StringFilter<'AccountContact'> | string;
    AccContLastName?: StringNullableFilter<'AccountContact'> | string | null;
    AccContPhone?: StringNullableFilter<'AccountContact'> | string | null;
    AccContMainEmail?: StringNullableFilter<'AccountContact'> | string | null;
  };

  export type AccountSubscriptionUpsertWithWhereUniqueWithoutAccountInput = {
    where: AccountSubscriptionWhereUniqueInput;
    update: XOR<AccountSubscriptionUpdateWithoutAccountInput, AccountSubscriptionUncheckedUpdateWithoutAccountInput>;
    create: XOR<AccountSubscriptionCreateWithoutAccountInput, AccountSubscriptionUncheckedCreateWithoutAccountInput>;
  };

  export type AccountSubscriptionUpdateWithWhereUniqueWithoutAccountInput = {
    where: AccountSubscriptionWhereUniqueInput;
    data: XOR<AccountSubscriptionUpdateWithoutAccountInput, AccountSubscriptionUncheckedUpdateWithoutAccountInput>;
  };

  export type AccountSubscriptionUpdateManyWithWhereWithoutAccountInput = {
    where: AccountSubscriptionScalarWhereInput;
    data: XOR<AccountSubscriptionUpdateManyMutationInput, AccountSubscriptionUncheckedUpdateManyWithoutAccountInput>;
  };

  export type AccountSubscriptionScalarWhereInput = {
    AND?: AccountSubscriptionScalarWhereInput | AccountSubscriptionScalarWhereInput[];
    OR?: AccountSubscriptionScalarWhereInput[];
    NOT?: AccountSubscriptionScalarWhereInput | AccountSubscriptionScalarWhereInput[];
    AccSubId?: IntFilter<'AccountSubscription'> | number;
    AccSubAccountId?: IntFilter<'AccountSubscription'> | number;
    AccSubPlanId?: IntFilter<'AccountSubscription'> | number;
    AccSubStartDate?: DateTimeFilter<'AccountSubscription'> | Date | string;
    AccSubEndDate?: DateTimeNullableFilter<'AccountSubscription'> | Date | string | null;
    AccSubIsActive?: BoolNullableFilter<'AccountSubscription'> | boolean | null;
  };

  export type AccountUserUpsertWithWhereUniqueWithoutAccountInput = {
    where: AccountUserWhereUniqueInput;
    update: XOR<AccountUserUpdateWithoutAccountInput, AccountUserUncheckedUpdateWithoutAccountInput>;
    create: XOR<AccountUserCreateWithoutAccountInput, AccountUserUncheckedCreateWithoutAccountInput>;
  };

  export type AccountUserUpdateWithWhereUniqueWithoutAccountInput = {
    where: AccountUserWhereUniqueInput;
    data: XOR<AccountUserUpdateWithoutAccountInput, AccountUserUncheckedUpdateWithoutAccountInput>;
  };

  export type AccountUserUpdateManyWithWhereWithoutAccountInput = {
    where: AccountUserScalarWhereInput;
    data: XOR<AccountUserUpdateManyMutationInput, AccountUserUncheckedUpdateManyWithoutAccountInput>;
  };

  export type AccountUserScalarWhereInput = {
    AND?: AccountUserScalarWhereInput | AccountUserScalarWhereInput[];
    OR?: AccountUserScalarWhereInput[];
    NOT?: AccountUserScalarWhereInput | AccountUserScalarWhereInput[];
    AccUserId?: IntFilter<'AccountUser'> | number;
    AccUserUserId?: IntFilter<'AccountUser'> | number;
    AccUserAccountId?: IntFilter<'AccountUser'> | number;
    AccUserIsAdmin?: BoolFilter<'AccountUser'> | boolean;
    AccUserPIN?: StringNullableFilter<'AccountUser'> | string | null;
  };

  export type ProductionCompanyUpsertWithWhereUniqueWithoutAccountInput = {
    where: ProductionCompanyWhereUniqueInput;
    update: XOR<ProductionCompanyUpdateWithoutAccountInput, ProductionCompanyUncheckedUpdateWithoutAccountInput>;
    create: XOR<ProductionCompanyCreateWithoutAccountInput, ProductionCompanyUncheckedCreateWithoutAccountInput>;
  };

  export type ProductionCompanyUpdateWithWhereUniqueWithoutAccountInput = {
    where: ProductionCompanyWhereUniqueInput;
    data: XOR<ProductionCompanyUpdateWithoutAccountInput, ProductionCompanyUncheckedUpdateWithoutAccountInput>;
  };

  export type ProductionCompanyUpdateManyWithWhereWithoutAccountInput = {
    where: ProductionCompanyScalarWhereInput;
    data: XOR<ProductionCompanyUpdateManyMutationInput, ProductionCompanyUncheckedUpdateManyWithoutAccountInput>;
  };

  export type ProductionCompanyScalarWhereInput = {
    AND?: ProductionCompanyScalarWhereInput | ProductionCompanyScalarWhereInput[];
    OR?: ProductionCompanyScalarWhereInput[];
    NOT?: ProductionCompanyScalarWhereInput | ProductionCompanyScalarWhereInput[];
    ProdCoId?: IntFilter<'ProductionCompany'> | number;
    ProdCoAccountId?: IntFilter<'ProductionCompany'> | number;
    ProdCoName?: StringFilter<'ProductionCompany'> | string;
    ProdCoWebSite?: StringNullableFilter<'ProductionCompany'> | string | null;
    ProdCoSaleStartWeek?: IntNullableFilter<'ProductionCompany'> | number | null;
    ProdCoVATCode?: StringNullableFilter<'ProductionCompany'> | string | null;
    ProdCoLogoFileId?: IntNullableFilter<'ProductionCompany'> | number | null;
  };

  export type AccountCreateWithoutAccountContactInput = {
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    Currency?: CurrencyCreateNestedOneWithoutAccountInput;
    File?: FileCreateNestedOneWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutAccountInput;
  };

  export type AccountUncheckedCreateWithoutAccountContactInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
    AccountSubscription?: AccountSubscriptionUncheckedCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserUncheckedCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type AccountCreateOrConnectWithoutAccountContactInput = {
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateWithoutAccountContactInput, AccountUncheckedCreateWithoutAccountContactInput>;
  };

  export type AccountUpsertWithoutAccountContactInput = {
    update: XOR<AccountUpdateWithoutAccountContactInput, AccountUncheckedUpdateWithoutAccountContactInput>;
    create: XOR<AccountCreateWithoutAccountContactInput, AccountUncheckedCreateWithoutAccountContactInput>;
    where?: AccountWhereInput;
  };

  export type AccountUpdateToOneWithWhereWithoutAccountContactInput = {
    where?: AccountWhereInput;
    data: XOR<AccountUpdateWithoutAccountContactInput, AccountUncheckedUpdateWithoutAccountContactInput>;
  };

  export type AccountUpdateWithoutAccountContactInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    Currency?: CurrencyUpdateOneWithoutAccountNestedInput;
    File?: FileUpdateOneWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateWithoutAccountContactInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountSubscription?: AccountSubscriptionUncheckedUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUncheckedUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type AccountCreateWithoutAccountSubscriptionInput = {
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    Currency?: CurrencyCreateNestedOneWithoutAccountInput;
    File?: FileCreateNestedOneWithoutAccountInput;
    AccountContact?: AccountContactCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutAccountInput;
  };

  export type AccountUncheckedCreateWithoutAccountSubscriptionInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
    AccountContact?: AccountContactUncheckedCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserUncheckedCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type AccountCreateOrConnectWithoutAccountSubscriptionInput = {
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateWithoutAccountSubscriptionInput, AccountUncheckedCreateWithoutAccountSubscriptionInput>;
  };

  export type SubscriptionPlanCreateWithoutAccountSubscriptionInput = {
    PlanName: string;
    PlanDescription?: string | null;
    PlanPrice: Decimal | DecimalJsLike | number | string;
    PlanFrequency: number;
    PlanPriceId?: string | null;
    PlanCurrency: string;
  };

  export type SubscriptionPlanUncheckedCreateWithoutAccountSubscriptionInput = {
    PlanId?: number;
    PlanName: string;
    PlanDescription?: string | null;
    PlanPrice: Decimal | DecimalJsLike | number | string;
    PlanFrequency: number;
    PlanPriceId?: string | null;
    PlanCurrency: string;
  };

  export type SubscriptionPlanCreateOrConnectWithoutAccountSubscriptionInput = {
    where: SubscriptionPlanWhereUniqueInput;
    create: XOR<
      SubscriptionPlanCreateWithoutAccountSubscriptionInput,
      SubscriptionPlanUncheckedCreateWithoutAccountSubscriptionInput
    >;
  };

  export type AccountUpsertWithoutAccountSubscriptionInput = {
    update: XOR<AccountUpdateWithoutAccountSubscriptionInput, AccountUncheckedUpdateWithoutAccountSubscriptionInput>;
    create: XOR<AccountCreateWithoutAccountSubscriptionInput, AccountUncheckedCreateWithoutAccountSubscriptionInput>;
    where?: AccountWhereInput;
  };

  export type AccountUpdateToOneWithWhereWithoutAccountSubscriptionInput = {
    where?: AccountWhereInput;
    data: XOR<AccountUpdateWithoutAccountSubscriptionInput, AccountUncheckedUpdateWithoutAccountSubscriptionInput>;
  };

  export type AccountUpdateWithoutAccountSubscriptionInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    Currency?: CurrencyUpdateOneWithoutAccountNestedInput;
    File?: FileUpdateOneWithoutAccountNestedInput;
    AccountContact?: AccountContactUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateWithoutAccountSubscriptionInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountContact?: AccountContactUncheckedUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUncheckedUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type SubscriptionPlanUpsertWithoutAccountSubscriptionInput = {
    update: XOR<
      SubscriptionPlanUpdateWithoutAccountSubscriptionInput,
      SubscriptionPlanUncheckedUpdateWithoutAccountSubscriptionInput
    >;
    create: XOR<
      SubscriptionPlanCreateWithoutAccountSubscriptionInput,
      SubscriptionPlanUncheckedCreateWithoutAccountSubscriptionInput
    >;
    where?: SubscriptionPlanWhereInput;
  };

  export type SubscriptionPlanUpdateToOneWithWhereWithoutAccountSubscriptionInput = {
    where?: SubscriptionPlanWhereInput;
    data: XOR<
      SubscriptionPlanUpdateWithoutAccountSubscriptionInput,
      SubscriptionPlanUncheckedUpdateWithoutAccountSubscriptionInput
    >;
  };

  export type SubscriptionPlanUpdateWithoutAccountSubscriptionInput = {
    PlanName?: StringFieldUpdateOperationsInput | string;
    PlanDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntFieldUpdateOperationsInput | number;
    PlanPriceId?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanCurrency?: StringFieldUpdateOperationsInput | string;
  };

  export type SubscriptionPlanUncheckedUpdateWithoutAccountSubscriptionInput = {
    PlanId?: IntFieldUpdateOperationsInput | number;
    PlanName?: StringFieldUpdateOperationsInput | string;
    PlanDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string;
    PlanFrequency?: IntFieldUpdateOperationsInput | number;
    PlanPriceId?: NullableStringFieldUpdateOperationsInput | string | null;
    PlanCurrency?: StringFieldUpdateOperationsInput | string;
  };

  export type AccountCreateWithoutAccountUserInput = {
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    Currency?: CurrencyCreateNestedOneWithoutAccountInput;
    File?: FileCreateNestedOneWithoutAccountInput;
    AccountContact?: AccountContactCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutAccountInput;
  };

  export type AccountUncheckedCreateWithoutAccountUserInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
    AccountContact?: AccountContactUncheckedCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionUncheckedCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type AccountCreateOrConnectWithoutAccountUserInput = {
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateWithoutAccountUserInput, AccountUncheckedCreateWithoutAccountUserInput>;
  };

  export type UserCreateWithoutAccountUserInput = {
    UserEmail: string;
    UserFirstName: string;
    UserLastName?: string | null;
    File?: FileCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutAccountUserInput = {
    UserId?: number;
    UserEmail: string;
    UserFirstName: string;
    UserLastName?: string | null;
    File?: FileUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutAccountUserInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutAccountUserInput, UserUncheckedCreateWithoutAccountUserInput>;
  };

  export type AccountUserPermissionCreateWithoutAccountUserInput = {
    Permission: PermissionCreateNestedOneWithoutAccountUserPermissionInput;
  };

  export type AccountUserPermissionUncheckedCreateWithoutAccountUserInput = {
    UserAuthId?: number;
    UserAuthPermissionId: number;
  };

  export type AccountUserPermissionCreateOrConnectWithoutAccountUserInput = {
    where: AccountUserPermissionWhereUniqueInput;
    create: XOR<
      AccountUserPermissionCreateWithoutAccountUserInput,
      AccountUserPermissionUncheckedCreateWithoutAccountUserInput
    >;
  };

  export type AccountUserPermissionCreateManyAccountUserInputEnvelope = {
    data: AccountUserPermissionCreateManyAccountUserInput | AccountUserPermissionCreateManyAccountUserInput[];
    skipDuplicates?: boolean;
  };

  export type AccountUpsertWithoutAccountUserInput = {
    update: XOR<AccountUpdateWithoutAccountUserInput, AccountUncheckedUpdateWithoutAccountUserInput>;
    create: XOR<AccountCreateWithoutAccountUserInput, AccountUncheckedCreateWithoutAccountUserInput>;
    where?: AccountWhereInput;
  };

  export type AccountUpdateToOneWithWhereWithoutAccountUserInput = {
    where?: AccountWhereInput;
    data: XOR<AccountUpdateWithoutAccountUserInput, AccountUncheckedUpdateWithoutAccountUserInput>;
  };

  export type AccountUpdateWithoutAccountUserInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    Currency?: CurrencyUpdateOneWithoutAccountNestedInput;
    File?: FileUpdateOneWithoutAccountNestedInput;
    AccountContact?: AccountContactUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateWithoutAccountUserInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountContact?: AccountContactUncheckedUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUncheckedUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type UserUpsertWithoutAccountUserInput = {
    update: XOR<UserUpdateWithoutAccountUserInput, UserUncheckedUpdateWithoutAccountUserInput>;
    create: XOR<UserCreateWithoutAccountUserInput, UserUncheckedCreateWithoutAccountUserInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutAccountUserInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutAccountUserInput, UserUncheckedUpdateWithoutAccountUserInput>;
  };

  export type UserUpdateWithoutAccountUserInput = {
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    File?: FileUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutAccountUserInput = {
    UserId?: IntFieldUpdateOperationsInput | number;
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    File?: FileUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type AccountUserPermissionUpsertWithWhereUniqueWithoutAccountUserInput = {
    where: AccountUserPermissionWhereUniqueInput;
    update: XOR<
      AccountUserPermissionUpdateWithoutAccountUserInput,
      AccountUserPermissionUncheckedUpdateWithoutAccountUserInput
    >;
    create: XOR<
      AccountUserPermissionCreateWithoutAccountUserInput,
      AccountUserPermissionUncheckedCreateWithoutAccountUserInput
    >;
  };

  export type AccountUserPermissionUpdateWithWhereUniqueWithoutAccountUserInput = {
    where: AccountUserPermissionWhereUniqueInput;
    data: XOR<
      AccountUserPermissionUpdateWithoutAccountUserInput,
      AccountUserPermissionUncheckedUpdateWithoutAccountUserInput
    >;
  };

  export type AccountUserPermissionUpdateManyWithWhereWithoutAccountUserInput = {
    where: AccountUserPermissionScalarWhereInput;
    data: XOR<
      AccountUserPermissionUpdateManyMutationInput,
      AccountUserPermissionUncheckedUpdateManyWithoutAccountUserInput
    >;
  };

  export type AccountUserPermissionScalarWhereInput = {
    AND?: AccountUserPermissionScalarWhereInput | AccountUserPermissionScalarWhereInput[];
    OR?: AccountUserPermissionScalarWhereInput[];
    NOT?: AccountUserPermissionScalarWhereInput | AccountUserPermissionScalarWhereInput[];
    UserAuthId?: IntFilter<'AccountUserPermission'> | number;
    UserAuthAccUserId?: IntFilter<'AccountUserPermission'> | number;
    UserAuthPermissionId?: IntFilter<'AccountUserPermission'> | number;
  };

  export type AccountUserCreateWithoutAccountUserPermissionInput = {
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
    Account: AccountCreateNestedOneWithoutAccountUserInput;
    User: UserCreateNestedOneWithoutAccountUserInput;
  };

  export type AccountUserUncheckedCreateWithoutAccountUserPermissionInput = {
    AccUserId?: number;
    AccUserUserId: number;
    AccUserAccountId: number;
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
  };

  export type AccountUserCreateOrConnectWithoutAccountUserPermissionInput = {
    where: AccountUserWhereUniqueInput;
    create: XOR<
      AccountUserCreateWithoutAccountUserPermissionInput,
      AccountUserUncheckedCreateWithoutAccountUserPermissionInput
    >;
  };

  export type PermissionCreateWithoutAccountUserPermissionInput = {
    PermissionParentPermissionId?: number | null;
    PermissionName: string;
    PermissionDescription: string;
    PermissionSeqNo?: number | null;
  };

  export type PermissionUncheckedCreateWithoutAccountUserPermissionInput = {
    PermissionId?: number;
    PermissionParentPermissionId?: number | null;
    PermissionName: string;
    PermissionDescription: string;
    PermissionSeqNo?: number | null;
  };

  export type PermissionCreateOrConnectWithoutAccountUserPermissionInput = {
    where: PermissionWhereUniqueInput;
    create: XOR<
      PermissionCreateWithoutAccountUserPermissionInput,
      PermissionUncheckedCreateWithoutAccountUserPermissionInput
    >;
  };

  export type AccountUserUpsertWithoutAccountUserPermissionInput = {
    update: XOR<
      AccountUserUpdateWithoutAccountUserPermissionInput,
      AccountUserUncheckedUpdateWithoutAccountUserPermissionInput
    >;
    create: XOR<
      AccountUserCreateWithoutAccountUserPermissionInput,
      AccountUserUncheckedCreateWithoutAccountUserPermissionInput
    >;
    where?: AccountUserWhereInput;
  };

  export type AccountUserUpdateToOneWithWhereWithoutAccountUserPermissionInput = {
    where?: AccountUserWhereInput;
    data: XOR<
      AccountUserUpdateWithoutAccountUserPermissionInput,
      AccountUserUncheckedUpdateWithoutAccountUserPermissionInput
    >;
  };

  export type AccountUserUpdateWithoutAccountUserPermissionInput = {
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUpdateOneRequiredWithoutAccountUserNestedInput;
    User?: UserUpdateOneRequiredWithoutAccountUserNestedInput;
  };

  export type AccountUserUncheckedUpdateWithoutAccountUserPermissionInput = {
    AccUserId?: IntFieldUpdateOperationsInput | number;
    AccUserUserId?: IntFieldUpdateOperationsInput | number;
    AccUserAccountId?: IntFieldUpdateOperationsInput | number;
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type PermissionUpsertWithoutAccountUserPermissionInput = {
    update: XOR<
      PermissionUpdateWithoutAccountUserPermissionInput,
      PermissionUncheckedUpdateWithoutAccountUserPermissionInput
    >;
    create: XOR<
      PermissionCreateWithoutAccountUserPermissionInput,
      PermissionUncheckedCreateWithoutAccountUserPermissionInput
    >;
    where?: PermissionWhereInput;
  };

  export type PermissionUpdateToOneWithWhereWithoutAccountUserPermissionInput = {
    where?: PermissionWhereInput;
    data: XOR<
      PermissionUpdateWithoutAccountUserPermissionInput,
      PermissionUncheckedUpdateWithoutAccountUserPermissionInput
    >;
  };

  export type PermissionUpdateWithoutAccountUserPermissionInput = {
    PermissionParentPermissionId?: NullableIntFieldUpdateOperationsInput | number | null;
    PermissionName?: StringFieldUpdateOperationsInput | string;
    PermissionDescription?: StringFieldUpdateOperationsInput | string;
    PermissionSeqNo?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type PermissionUncheckedUpdateWithoutAccountUserPermissionInput = {
    PermissionId?: IntFieldUpdateOperationsInput | number;
    PermissionParentPermissionId?: NullableIntFieldUpdateOperationsInput | number | null;
    PermissionName?: StringFieldUpdateOperationsInput | string;
    PermissionDescription?: StringFieldUpdateOperationsInput | string;
    PermissionSeqNo?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type AccountCreateWithoutCurrencyInput = {
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    File?: FileCreateNestedOneWithoutAccountInput;
    AccountContact?: AccountContactCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutAccountInput;
  };

  export type AccountUncheckedCreateWithoutCurrencyInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountContact?: AccountContactUncheckedCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionUncheckedCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserUncheckedCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type AccountCreateOrConnectWithoutCurrencyInput = {
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateWithoutCurrencyInput, AccountUncheckedCreateWithoutCurrencyInput>;
  };

  export type AccountCreateManyCurrencyInputEnvelope = {
    data: AccountCreateManyCurrencyInput | AccountCreateManyCurrencyInput[];
    skipDuplicates?: boolean;
  };

  export type AccountUpsertWithWhereUniqueWithoutCurrencyInput = {
    where: AccountWhereUniqueInput;
    update: XOR<AccountUpdateWithoutCurrencyInput, AccountUncheckedUpdateWithoutCurrencyInput>;
    create: XOR<AccountCreateWithoutCurrencyInput, AccountUncheckedCreateWithoutCurrencyInput>;
  };

  export type AccountUpdateWithWhereUniqueWithoutCurrencyInput = {
    where: AccountWhereUniqueInput;
    data: XOR<AccountUpdateWithoutCurrencyInput, AccountUncheckedUpdateWithoutCurrencyInput>;
  };

  export type AccountUpdateManyWithWhereWithoutCurrencyInput = {
    where: AccountScalarWhereInput;
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutCurrencyInput>;
  };

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[];
    OR?: AccountScalarWhereInput[];
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[];
    AccountId?: IntFilter<'Account'> | number;
    AccountName?: StringFilter<'Account'> | string;
    AccountAddress1?: StringNullableFilter<'Account'> | string | null;
    AccountAddress2?: StringNullableFilter<'Account'> | string | null;
    AccountAddress3?: StringNullableFilter<'Account'> | string | null;
    AccountAddressTown?: StringNullableFilter<'Account'> | string | null;
    AccountAddressCounty?: StringNullableFilter<'Account'> | string | null;
    AccountAddressPostcode?: StringNullableFilter<'Account'> | string | null;
    AccountAddressCountry?: StringNullableFilter<'Account'> | string | null;
    AccountVATNumber?: StringNullableFilter<'Account'> | string | null;
    AccountCurrencyCode?: StringFilter<'Account'> | string;
    AccountCompanyNumber?: StringNullableFilter<'Account'> | string | null;
    AccountLogoFileId?: IntNullableFilter<'Account'> | number | null;
    AccountMainEmail?: StringNullableFilter<'Account'> | string | null;
    AccountNumPeople?: IntNullableFilter<'Account'> | number | null;
    AccountOrganisationId?: StringNullableFilter<'Account'> | string | null;
    AccountTermsAgreedBy?: StringNullableFilter<'Account'> | string | null;
    AccountTermsAgreedDate?: DateTimeNullableFilter<'Account'> | Date | string | null;
    AccountWebsite?: StringNullableFilter<'Account'> | string | null;
    AccountTypeOfCompany?: StringNullableFilter<'Account'> | string | null;
    AccountPhone?: StringNullableFilter<'Account'> | string | null;
    AccountPaymentCurrencyCode?: StringNullableFilter<'Account'> | string | null;
  };

  export type AccountCreateWithoutFileInput = {
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    Currency?: CurrencyCreateNestedOneWithoutAccountInput;
    AccountContact?: AccountContactCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutAccountInput;
  };

  export type AccountUncheckedCreateWithoutFileInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
    AccountContact?: AccountContactUncheckedCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionUncheckedCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserUncheckedCreateNestedManyWithoutAccountInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type AccountCreateOrConnectWithoutFileInput = {
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateWithoutFileInput, AccountUncheckedCreateWithoutFileInput>;
  };

  export type AccountCreateManyFileInputEnvelope = {
    data: AccountCreateManyFileInput | AccountCreateManyFileInput[];
    skipDuplicates?: boolean;
  };

  export type UserCreateWithoutFileInput = {
    UserEmail: string;
    UserFirstName: string;
    UserLastName?: string | null;
    AccountUser?: AccountUserCreateNestedOneWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutFileInput = {
    UserId?: number;
    UserEmail: string;
    UserFirstName: string;
    UserLastName?: string | null;
    AccountUser?: AccountUserUncheckedCreateNestedOneWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutFileInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutFileInput, UserUncheckedCreateWithoutFileInput>;
  };

  export type ProductionCompanyCreateWithoutFileInput = {
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
    Account: AccountCreateNestedOneWithoutProductionCompanyInput;
  };

  export type ProductionCompanyUncheckedCreateWithoutFileInput = {
    ProdCoId?: number;
    ProdCoAccountId: number;
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
  };

  export type ProductionCompanyCreateOrConnectWithoutFileInput = {
    where: ProductionCompanyWhereUniqueInput;
    create: XOR<ProductionCompanyCreateWithoutFileInput, ProductionCompanyUncheckedCreateWithoutFileInput>;
  };

  export type ProductionCompanyCreateManyFileInputEnvelope = {
    data: ProductionCompanyCreateManyFileInput | ProductionCompanyCreateManyFileInput[];
    skipDuplicates?: boolean;
  };

  export type AccountUpsertWithWhereUniqueWithoutFileInput = {
    where: AccountWhereUniqueInput;
    update: XOR<AccountUpdateWithoutFileInput, AccountUncheckedUpdateWithoutFileInput>;
    create: XOR<AccountCreateWithoutFileInput, AccountUncheckedCreateWithoutFileInput>;
  };

  export type AccountUpdateWithWhereUniqueWithoutFileInput = {
    where: AccountWhereUniqueInput;
    data: XOR<AccountUpdateWithoutFileInput, AccountUncheckedUpdateWithoutFileInput>;
  };

  export type AccountUpdateManyWithWhereWithoutFileInput = {
    where: AccountScalarWhereInput;
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutFileInput>;
  };

  export type UserUpsertWithoutFileInput = {
    update: XOR<UserUpdateWithoutFileInput, UserUncheckedUpdateWithoutFileInput>;
    create: XOR<UserCreateWithoutFileInput, UserUncheckedCreateWithoutFileInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutFileInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutFileInput, UserUncheckedUpdateWithoutFileInput>;
  };

  export type UserUpdateWithoutFileInput = {
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountUser?: AccountUserUpdateOneWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutFileInput = {
    UserId?: IntFieldUpdateOperationsInput | number;
    UserEmail?: StringFieldUpdateOperationsInput | string;
    UserFirstName?: StringFieldUpdateOperationsInput | string;
    UserLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountUser?: AccountUserUncheckedUpdateOneWithoutUserNestedInput;
  };

  export type ProductionCompanyUpsertWithWhereUniqueWithoutFileInput = {
    where: ProductionCompanyWhereUniqueInput;
    update: XOR<ProductionCompanyUpdateWithoutFileInput, ProductionCompanyUncheckedUpdateWithoutFileInput>;
    create: XOR<ProductionCompanyCreateWithoutFileInput, ProductionCompanyUncheckedCreateWithoutFileInput>;
  };

  export type ProductionCompanyUpdateWithWhereUniqueWithoutFileInput = {
    where: ProductionCompanyWhereUniqueInput;
    data: XOR<ProductionCompanyUpdateWithoutFileInput, ProductionCompanyUncheckedUpdateWithoutFileInput>;
  };

  export type ProductionCompanyUpdateManyWithWhereWithoutFileInput = {
    where: ProductionCompanyScalarWhereInput;
    data: XOR<ProductionCompanyUpdateManyMutationInput, ProductionCompanyUncheckedUpdateManyWithoutFileInput>;
  };

  export type AccountUserPermissionCreateWithoutPermissionInput = {
    AccountUser: AccountUserCreateNestedOneWithoutAccountUserPermissionInput;
  };

  export type AccountUserPermissionUncheckedCreateWithoutPermissionInput = {
    UserAuthId?: number;
    UserAuthAccUserId: number;
  };

  export type AccountUserPermissionCreateOrConnectWithoutPermissionInput = {
    where: AccountUserPermissionWhereUniqueInput;
    create: XOR<
      AccountUserPermissionCreateWithoutPermissionInput,
      AccountUserPermissionUncheckedCreateWithoutPermissionInput
    >;
  };

  export type AccountUserPermissionCreateManyPermissionInputEnvelope = {
    data: AccountUserPermissionCreateManyPermissionInput | AccountUserPermissionCreateManyPermissionInput[];
    skipDuplicates?: boolean;
  };

  export type AccountUserPermissionUpsertWithWhereUniqueWithoutPermissionInput = {
    where: AccountUserPermissionWhereUniqueInput;
    update: XOR<
      AccountUserPermissionUpdateWithoutPermissionInput,
      AccountUserPermissionUncheckedUpdateWithoutPermissionInput
    >;
    create: XOR<
      AccountUserPermissionCreateWithoutPermissionInput,
      AccountUserPermissionUncheckedCreateWithoutPermissionInput
    >;
  };

  export type AccountUserPermissionUpdateWithWhereUniqueWithoutPermissionInput = {
    where: AccountUserPermissionWhereUniqueInput;
    data: XOR<
      AccountUserPermissionUpdateWithoutPermissionInput,
      AccountUserPermissionUncheckedUpdateWithoutPermissionInput
    >;
  };

  export type AccountUserPermissionUpdateManyWithWhereWithoutPermissionInput = {
    where: AccountUserPermissionScalarWhereInput;
    data: XOR<
      AccountUserPermissionUpdateManyMutationInput,
      AccountUserPermissionUncheckedUpdateManyWithoutPermissionInput
    >;
  };

  export type AccountCreateWithoutProductionCompanyInput = {
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    Currency?: CurrencyCreateNestedOneWithoutAccountInput;
    File?: FileCreateNestedOneWithoutAccountInput;
    AccountContact?: AccountContactCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserCreateNestedManyWithoutAccountInput;
  };

  export type AccountUncheckedCreateWithoutProductionCompanyInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
    AccountContact?: AccountContactUncheckedCreateNestedManyWithoutAccountInput;
    AccountSubscription?: AccountSubscriptionUncheckedCreateNestedManyWithoutAccountInput;
    AccountUser?: AccountUserUncheckedCreateNestedManyWithoutAccountInput;
  };

  export type AccountCreateOrConnectWithoutProductionCompanyInput = {
    where: AccountWhereUniqueInput;
    create: XOR<AccountCreateWithoutProductionCompanyInput, AccountUncheckedCreateWithoutProductionCompanyInput>;
  };

  export type FileCreateWithoutProductionCompanyInput = {
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileSizeBytes?: bigint | number | null;
    Account?: AccountCreateNestedManyWithoutFileInput;
    User: UserCreateNestedOneWithoutFileInput;
  };

  export type FileUncheckedCreateWithoutProductionCompanyInput = {
    FileId?: number;
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileUploadUserId: number;
    FileSizeBytes?: bigint | number | null;
    Account?: AccountUncheckedCreateNestedManyWithoutFileInput;
  };

  export type FileCreateOrConnectWithoutProductionCompanyInput = {
    where: FileWhereUniqueInput;
    create: XOR<FileCreateWithoutProductionCompanyInput, FileUncheckedCreateWithoutProductionCompanyInput>;
  };

  export type AccountUpsertWithoutProductionCompanyInput = {
    update: XOR<AccountUpdateWithoutProductionCompanyInput, AccountUncheckedUpdateWithoutProductionCompanyInput>;
    create: XOR<AccountCreateWithoutProductionCompanyInput, AccountUncheckedCreateWithoutProductionCompanyInput>;
    where?: AccountWhereInput;
  };

  export type AccountUpdateToOneWithWhereWithoutProductionCompanyInput = {
    where?: AccountWhereInput;
    data: XOR<AccountUpdateWithoutProductionCompanyInput, AccountUncheckedUpdateWithoutProductionCompanyInput>;
  };

  export type AccountUpdateWithoutProductionCompanyInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    Currency?: CurrencyUpdateOneWithoutAccountNestedInput;
    File?: FileUpdateOneWithoutAccountNestedInput;
    AccountContact?: AccountContactUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateWithoutProductionCompanyInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountContact?: AccountContactUncheckedUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUncheckedUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type FileUpsertWithoutProductionCompanyInput = {
    update: XOR<FileUpdateWithoutProductionCompanyInput, FileUncheckedUpdateWithoutProductionCompanyInput>;
    create: XOR<FileCreateWithoutProductionCompanyInput, FileUncheckedCreateWithoutProductionCompanyInput>;
    where?: FileWhereInput;
  };

  export type FileUpdateToOneWithWhereWithoutProductionCompanyInput = {
    where?: FileWhereInput;
    data: XOR<FileUpdateWithoutProductionCompanyInput, FileUncheckedUpdateWithoutProductionCompanyInput>;
  };

  export type FileUpdateWithoutProductionCompanyInput = {
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    Account?: AccountUpdateManyWithoutFileNestedInput;
    User?: UserUpdateOneRequiredWithoutFileNestedInput;
  };

  export type FileUncheckedUpdateWithoutProductionCompanyInput = {
    FileId?: IntFieldUpdateOperationsInput | number;
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileUploadUserId?: IntFieldUpdateOperationsInput | number;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    Account?: AccountUncheckedUpdateManyWithoutFileNestedInput;
  };

  export type AccountSubscriptionCreateWithoutSubscriptionPlanInput = {
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
    Account: AccountCreateNestedOneWithoutAccountSubscriptionInput;
  };

  export type AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput = {
    AccSubId?: number;
    AccSubAccountId: number;
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
  };

  export type AccountSubscriptionCreateOrConnectWithoutSubscriptionPlanInput = {
    where: AccountSubscriptionWhereUniqueInput;
    create: XOR<
      AccountSubscriptionCreateWithoutSubscriptionPlanInput,
      AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput
    >;
  };

  export type AccountSubscriptionCreateManySubscriptionPlanInputEnvelope = {
    data: AccountSubscriptionCreateManySubscriptionPlanInput | AccountSubscriptionCreateManySubscriptionPlanInput[];
    skipDuplicates?: boolean;
  };

  export type AccountSubscriptionUpsertWithWhereUniqueWithoutSubscriptionPlanInput = {
    where: AccountSubscriptionWhereUniqueInput;
    update: XOR<
      AccountSubscriptionUpdateWithoutSubscriptionPlanInput,
      AccountSubscriptionUncheckedUpdateWithoutSubscriptionPlanInput
    >;
    create: XOR<
      AccountSubscriptionCreateWithoutSubscriptionPlanInput,
      AccountSubscriptionUncheckedCreateWithoutSubscriptionPlanInput
    >;
  };

  export type AccountSubscriptionUpdateWithWhereUniqueWithoutSubscriptionPlanInput = {
    where: AccountSubscriptionWhereUniqueInput;
    data: XOR<
      AccountSubscriptionUpdateWithoutSubscriptionPlanInput,
      AccountSubscriptionUncheckedUpdateWithoutSubscriptionPlanInput
    >;
  };

  export type AccountSubscriptionUpdateManyWithWhereWithoutSubscriptionPlanInput = {
    where: AccountSubscriptionScalarWhereInput;
    data: XOR<
      AccountSubscriptionUpdateManyMutationInput,
      AccountSubscriptionUncheckedUpdateManyWithoutSubscriptionPlanInput
    >;
  };

  export type AccountUserCreateWithoutUserInput = {
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
    Account: AccountCreateNestedOneWithoutAccountUserInput;
    AccountUserPermission?: AccountUserPermissionCreateNestedManyWithoutAccountUserInput;
  };

  export type AccountUserUncheckedCreateWithoutUserInput = {
    AccUserId?: number;
    AccUserAccountId: number;
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
    AccountUserPermission?: AccountUserPermissionUncheckedCreateNestedManyWithoutAccountUserInput;
  };

  export type AccountUserCreateOrConnectWithoutUserInput = {
    where: AccountUserWhereUniqueInput;
    create: XOR<AccountUserCreateWithoutUserInput, AccountUserUncheckedCreateWithoutUserInput>;
  };

  export type FileCreateWithoutUserInput = {
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileSizeBytes?: bigint | number | null;
    Account?: AccountCreateNestedManyWithoutFileInput;
    ProductionCompany?: ProductionCompanyCreateNestedManyWithoutFileInput;
  };

  export type FileUncheckedCreateWithoutUserInput = {
    FileId?: number;
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileSizeBytes?: bigint | number | null;
    Account?: AccountUncheckedCreateNestedManyWithoutFileInput;
    ProductionCompany?: ProductionCompanyUncheckedCreateNestedManyWithoutFileInput;
  };

  export type FileCreateOrConnectWithoutUserInput = {
    where: FileWhereUniqueInput;
    create: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>;
  };

  export type FileCreateManyUserInputEnvelope = {
    data: FileCreateManyUserInput | FileCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type AccountUserUpsertWithoutUserInput = {
    update: XOR<AccountUserUpdateWithoutUserInput, AccountUserUncheckedUpdateWithoutUserInput>;
    create: XOR<AccountUserCreateWithoutUserInput, AccountUserUncheckedCreateWithoutUserInput>;
    where?: AccountUserWhereInput;
  };

  export type AccountUserUpdateToOneWithWhereWithoutUserInput = {
    where?: AccountUserWhereInput;
    data: XOR<AccountUserUpdateWithoutUserInput, AccountUserUncheckedUpdateWithoutUserInput>;
  };

  export type AccountUserUpdateWithoutUserInput = {
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUpdateOneRequiredWithoutAccountUserNestedInput;
    AccountUserPermission?: AccountUserPermissionUpdateManyWithoutAccountUserNestedInput;
  };

  export type AccountUserUncheckedUpdateWithoutUserInput = {
    AccUserId?: IntFieldUpdateOperationsInput | number;
    AccUserAccountId?: IntFieldUpdateOperationsInput | number;
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountUserPermission?: AccountUserPermissionUncheckedUpdateManyWithoutAccountUserNestedInput;
  };

  export type FileUpsertWithWhereUniqueWithoutUserInput = {
    where: FileWhereUniqueInput;
    update: XOR<FileUpdateWithoutUserInput, FileUncheckedUpdateWithoutUserInput>;
    create: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>;
  };

  export type FileUpdateWithWhereUniqueWithoutUserInput = {
    where: FileWhereUniqueInput;
    data: XOR<FileUpdateWithoutUserInput, FileUncheckedUpdateWithoutUserInput>;
  };

  export type FileUpdateManyWithWhereWithoutUserInput = {
    where: FileScalarWhereInput;
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutUserInput>;
  };

  export type FileScalarWhereInput = {
    AND?: FileScalarWhereInput | FileScalarWhereInput[];
    OR?: FileScalarWhereInput[];
    NOT?: FileScalarWhereInput | FileScalarWhereInput[];
    FileId?: IntFilter<'File'> | number;
    FileOriginalFilename?: StringFilter<'File'> | string;
    FileMediaType?: StringNullableFilter<'File'> | string | null;
    FileLocation?: StringFilter<'File'> | string;
    FileUploadDateTime?: DateTimeFilter<'File'> | Date | string;
    FileUploadUserId?: IntFilter<'File'> | number;
    FileSizeBytes?: BigIntNullableFilter<'File'> | bigint | number | null;
  };

  export type AccountContactCreateManyAccountInput = {
    AccContId?: number;
    AccContFirstName: string;
    AccContLastName?: string | null;
    AccContPhone?: string | null;
    AccContMainEmail?: string | null;
  };

  export type AccountSubscriptionCreateManyAccountInput = {
    AccSubId?: number;
    AccSubPlanId: number;
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
  };

  export type AccountUserCreateManyAccountInput = {
    AccUserId?: number;
    AccUserUserId: number;
    AccUserIsAdmin?: boolean;
    AccUserPIN?: string | null;
  };

  export type ProductionCompanyCreateManyAccountInput = {
    ProdCoId?: number;
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
    ProdCoLogoFileId?: number | null;
  };

  export type AccountContactUpdateWithoutAccountInput = {
    AccContFirstName?: StringFieldUpdateOperationsInput | string;
    AccContLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountContactUncheckedUpdateWithoutAccountInput = {
    AccContId?: IntFieldUpdateOperationsInput | number;
    AccContFirstName?: StringFieldUpdateOperationsInput | string;
    AccContLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountContactUncheckedUpdateManyWithoutAccountInput = {
    AccContId?: IntFieldUpdateOperationsInput | number;
    AccContFirstName?: StringFieldUpdateOperationsInput | string;
    AccContLastName?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccContMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountSubscriptionUpdateWithoutAccountInput = {
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    SubscriptionPlan?: SubscriptionPlanUpdateOneRequiredWithoutAccountSubscriptionNestedInput;
  };

  export type AccountSubscriptionUncheckedUpdateWithoutAccountInput = {
    AccSubId?: IntFieldUpdateOperationsInput | number;
    AccSubPlanId?: IntFieldUpdateOperationsInput | number;
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
  };

  export type AccountSubscriptionUncheckedUpdateManyWithoutAccountInput = {
    AccSubId?: IntFieldUpdateOperationsInput | number;
    AccSubPlanId?: IntFieldUpdateOperationsInput | number;
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
  };

  export type AccountUserUpdateWithoutAccountInput = {
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
    User?: UserUpdateOneRequiredWithoutAccountUserNestedInput;
    AccountUserPermission?: AccountUserPermissionUpdateManyWithoutAccountUserNestedInput;
  };

  export type AccountUserUncheckedUpdateWithoutAccountInput = {
    AccUserId?: IntFieldUpdateOperationsInput | number;
    AccUserUserId?: IntFieldUpdateOperationsInput | number;
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountUserPermission?: AccountUserPermissionUncheckedUpdateManyWithoutAccountUserNestedInput;
  };

  export type AccountUserUncheckedUpdateManyWithoutAccountInput = {
    AccUserId?: IntFieldUpdateOperationsInput | number;
    AccUserUserId?: IntFieldUpdateOperationsInput | number;
    AccUserIsAdmin?: BoolFieldUpdateOperationsInput | boolean;
    AccUserPIN?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ProductionCompanyUpdateWithoutAccountInput = {
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
    File?: FileUpdateOneWithoutProductionCompanyNestedInput;
  };

  export type ProductionCompanyUncheckedUpdateWithoutAccountInput = {
    ProdCoId?: IntFieldUpdateOperationsInput | number;
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type ProductionCompanyUncheckedUpdateManyWithoutAccountInput = {
    ProdCoId?: IntFieldUpdateOperationsInput | number;
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type AccountUserPermissionCreateManyAccountUserInput = {
    UserAuthId?: number;
    UserAuthPermissionId: number;
  };

  export type AccountUserPermissionUpdateWithoutAccountUserInput = {
    Permission?: PermissionUpdateOneRequiredWithoutAccountUserPermissionNestedInput;
  };

  export type AccountUserPermissionUncheckedUpdateWithoutAccountUserInput = {
    UserAuthId?: IntFieldUpdateOperationsInput | number;
    UserAuthPermissionId?: IntFieldUpdateOperationsInput | number;
  };

  export type AccountUserPermissionUncheckedUpdateManyWithoutAccountUserInput = {
    UserAuthId?: IntFieldUpdateOperationsInput | number;
    UserAuthPermissionId?: IntFieldUpdateOperationsInput | number;
  };

  export type AccountCreateManyCurrencyInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountLogoFileId?: number | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
  };

  export type AccountUpdateWithoutCurrencyInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    File?: FileUpdateOneWithoutAccountNestedInput;
    AccountContact?: AccountContactUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateWithoutCurrencyInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountContact?: AccountContactUncheckedUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUncheckedUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUncheckedUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateManyWithoutCurrencyInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountLogoFileId?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountCreateManyFileInput = {
    AccountId?: number;
    AccountName: string;
    AccountAddress1?: string | null;
    AccountAddress2?: string | null;
    AccountAddress3?: string | null;
    AccountAddressTown?: string | null;
    AccountAddressCounty?: string | null;
    AccountAddressPostcode?: string | null;
    AccountAddressCountry?: string | null;
    AccountVATNumber?: string | null;
    AccountCurrencyCode: string;
    AccountCompanyNumber?: string | null;
    AccountMainEmail?: string | null;
    AccountNumPeople?: number | null;
    AccountOrganisationId?: string | null;
    AccountTermsAgreedBy?: string | null;
    AccountTermsAgreedDate?: Date | string | null;
    AccountWebsite?: string | null;
    AccountTypeOfCompany?: string | null;
    AccountPhone?: string | null;
    AccountPaymentCurrencyCode?: string | null;
  };

  export type ProductionCompanyCreateManyFileInput = {
    ProdCoId?: number;
    ProdCoAccountId: number;
    ProdCoName: string;
    ProdCoWebSite?: string | null;
    ProdCoSaleStartWeek?: number | null;
    ProdCoVATCode?: string | null;
  };

  export type AccountUpdateWithoutFileInput = {
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    Currency?: CurrencyUpdateOneWithoutAccountNestedInput;
    AccountContact?: AccountContactUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateWithoutFileInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountContact?: AccountContactUncheckedUpdateManyWithoutAccountNestedInput;
    AccountSubscription?: AccountSubscriptionUncheckedUpdateManyWithoutAccountNestedInput;
    AccountUser?: AccountUserUncheckedUpdateManyWithoutAccountNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateManyWithoutFileInput = {
    AccountId?: IntFieldUpdateOperationsInput | number;
    AccountName?: StringFieldUpdateOperationsInput | string;
    AccountAddress1?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress2?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddress3?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressTown?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCounty?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressPostcode?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountAddressCountry?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountVATNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountCurrencyCode?: StringFieldUpdateOperationsInput | string;
    AccountCompanyNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountMainEmail?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountNumPeople?: NullableIntFieldUpdateOperationsInput | number | null;
    AccountOrganisationId?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedBy?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTermsAgreedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccountWebsite?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountTypeOfCompany?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPhone?: NullableStringFieldUpdateOperationsInput | string | null;
    AccountPaymentCurrencyCode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ProductionCompanyUpdateWithoutFileInput = {
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
    Account?: AccountUpdateOneRequiredWithoutProductionCompanyNestedInput;
  };

  export type ProductionCompanyUncheckedUpdateWithoutFileInput = {
    ProdCoId?: IntFieldUpdateOperationsInput | number;
    ProdCoAccountId?: IntFieldUpdateOperationsInput | number;
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ProductionCompanyUncheckedUpdateManyWithoutFileInput = {
    ProdCoId?: IntFieldUpdateOperationsInput | number;
    ProdCoAccountId?: IntFieldUpdateOperationsInput | number;
    ProdCoName?: StringFieldUpdateOperationsInput | string;
    ProdCoWebSite?: NullableStringFieldUpdateOperationsInput | string | null;
    ProdCoSaleStartWeek?: NullableIntFieldUpdateOperationsInput | number | null;
    ProdCoVATCode?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AccountUserPermissionCreateManyPermissionInput = {
    UserAuthId?: number;
    UserAuthAccUserId: number;
  };

  export type AccountUserPermissionUpdateWithoutPermissionInput = {
    AccountUser?: AccountUserUpdateOneRequiredWithoutAccountUserPermissionNestedInput;
  };

  export type AccountUserPermissionUncheckedUpdateWithoutPermissionInput = {
    UserAuthId?: IntFieldUpdateOperationsInput | number;
    UserAuthAccUserId?: IntFieldUpdateOperationsInput | number;
  };

  export type AccountUserPermissionUncheckedUpdateManyWithoutPermissionInput = {
    UserAuthId?: IntFieldUpdateOperationsInput | number;
    UserAuthAccUserId?: IntFieldUpdateOperationsInput | number;
  };

  export type AccountSubscriptionCreateManySubscriptionPlanInput = {
    AccSubId?: number;
    AccSubAccountId: number;
    AccSubStartDate: Date | string;
    AccSubEndDate?: Date | string | null;
    AccSubIsActive?: boolean | null;
  };

  export type AccountSubscriptionUpdateWithoutSubscriptionPlanInput = {
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    Account?: AccountUpdateOneRequiredWithoutAccountSubscriptionNestedInput;
  };

  export type AccountSubscriptionUncheckedUpdateWithoutSubscriptionPlanInput = {
    AccSubId?: IntFieldUpdateOperationsInput | number;
    AccSubAccountId?: IntFieldUpdateOperationsInput | number;
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
  };

  export type AccountSubscriptionUncheckedUpdateManyWithoutSubscriptionPlanInput = {
    AccSubId?: IntFieldUpdateOperationsInput | number;
    AccSubAccountId?: IntFieldUpdateOperationsInput | number;
    AccSubStartDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    AccSubEndDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    AccSubIsActive?: NullableBoolFieldUpdateOperationsInput | boolean | null;
  };

  export type FileCreateManyUserInput = {
    FileId?: number;
    FileOriginalFilename: string;
    FileMediaType?: string | null;
    FileLocation: string;
    FileUploadDateTime: Date | string;
    FileSizeBytes?: bigint | number | null;
  };

  export type FileUpdateWithoutUserInput = {
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    Account?: AccountUpdateManyWithoutFileNestedInput;
    ProductionCompany?: ProductionCompanyUpdateManyWithoutFileNestedInput;
  };

  export type FileUncheckedUpdateWithoutUserInput = {
    FileId?: IntFieldUpdateOperationsInput | number;
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
    Account?: AccountUncheckedUpdateManyWithoutFileNestedInput;
    ProductionCompany?: ProductionCompanyUncheckedUpdateManyWithoutFileNestedInput;
  };

  export type FileUncheckedUpdateManyWithoutUserInput = {
    FileId?: IntFieldUpdateOperationsInput | number;
    FileOriginalFilename?: StringFieldUpdateOperationsInput | string;
    FileMediaType?: NullableStringFieldUpdateOperationsInput | string | null;
    FileLocation?: StringFieldUpdateOperationsInput | string;
    FileUploadDateTime?: DateTimeFieldUpdateOperationsInput | Date | string;
    FileSizeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null;
  };

  /**
   * Aliases for legacy arg types
   */
  /**
   * @deprecated Use AccountCountOutputTypeDefaultArgs instead
   */
  export type AccountCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AccountCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AccountUserCountOutputTypeDefaultArgs instead
   */
  export type AccountUserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AccountUserCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use CurrencyCountOutputTypeDefaultArgs instead
   */
  export type CurrencyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    CurrencyCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use FileCountOutputTypeDefaultArgs instead
   */
  export type FileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    FileCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use PermissionCountOutputTypeDefaultArgs instead
   */
  export type PermissionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    PermissionCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use SubscriptionPlanCountOutputTypeDefaultArgs instead
   */
  export type SubscriptionPlanCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use UserCountOutputTypeDefaultArgs instead
   */
  export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    UserCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AccountDefaultArgs instead
   */
  export type AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AccountDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AccountContactDefaultArgs instead
   */
  export type AccountContactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AccountContactDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AccountSubscriptionDefaultArgs instead
   */
  export type AccountSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AccountSubscriptionDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AccountUserDefaultArgs instead
   */
  export type AccountUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AccountUserDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AccountUserPermissionDefaultArgs instead
   */
  export type AccountUserPermissionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    AccountUserPermissionDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use CurrencyDefaultArgs instead
   */
  export type CurrencyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    CurrencyDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use DBSettingDefaultArgs instead
   */
  export type DBSettingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    DBSettingDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use FileDefaultArgs instead
   */
  export type FileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use PermissionDefaultArgs instead
   */
  export type PermissionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    PermissionDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ProductionCompanyDefaultArgs instead
   */
  export type ProductionCompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    ProductionCompanyDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use SubscriptionPlanDefaultArgs instead
   */
  export type SubscriptionPlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    SubscriptionPlanDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use UserDefaultArgs instead
   */
  export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>;

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
