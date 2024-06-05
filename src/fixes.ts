type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

export function makeMutable<T>(obj: T): Mutable<T> {
  return obj as Mutable<T>;
}

export function coalesceAuthor(obj: { author: any }) {
  if (!obj.author) obj.author = { name: "Alan" };
}
