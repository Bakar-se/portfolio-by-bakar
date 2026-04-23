/**
 * Node can expose `globalThis.localStorage` when experimental Web Storage is
 * enabled but `--localstorage-file` is missing or invalid. The object exists
 * yet `getItem` / `setItem` are not functions, which breaks SSR for libraries
 * that only guard with `typeof localStorage !== "undefined"`.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }
  for (const key of ["localStorage", "sessionStorage"] as const) {
    try {
      const storage = (globalThis as unknown as Record<string, unknown>)[key];
      if (
        storage &&
        (typeof (storage as Storage).getItem !== "function" ||
          typeof (storage as Storage).setItem !== "function")
      ) {
        Reflect.deleteProperty(globalThis, key);
      }
    } catch {
      try {
        Reflect.deleteProperty(globalThis, key);
      } catch {
        /* non-configurable; nothing safe to do */
      }
    }
  }
}
