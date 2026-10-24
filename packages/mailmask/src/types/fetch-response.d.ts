/**
 * Fetch Response.
 *
 * Augments the global Response interface to add a generic json<T>() overload
 * so call sites can type the parsed response without an explicit cast.
 *
 * @since 0.0.1
 */
interface Response {
  json<T = unknown>(): Promise<T>;
}
