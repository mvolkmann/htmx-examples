import {Context, Hono} from 'hono';

// type T = keyof typeof Hono;
const methods = ['get', 'post', 'put', 'patch', 'delete'];

// type MethodReturn = Response | string | JSX.Element | object;
// type MethodReturn = string | object | Response | HtmlEscapedString;

export function enhance(app: Hono) {
  for (const method of methods) {
    // @ts-ignore
    const original = app[T];

    // @ts-ignore
    app[T] = (...args: any[]) => {
      const lastIndex = args.length - 1;
      const callback = args[lastIndex];
      const enhancedCallback = async (c: Context): Promise<any> => {
        let result = callback(c);
        if (result instanceof Promise) result = await result;
        if (result instanceof Response) return result;
        if (typeof result === 'string') return c.text(result);
        // if (result instanceof JSX.Element) return c.html(result);
        if (result.constructor.name.startsWith('JSX')) return c.html(result);
        return c.json(result);
      };
      args[lastIndex] = enhancedCallback;
      original(...args);
    };
  }
}
