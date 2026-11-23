import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFavorites, toggleFavorite } from "../../app/gallery/favorites.ts";

test("saved favorites are parsed defensively", () => {
  assert.deepEqual(parseFavorites(null), []);
  assert.deepEqual(parseFavorites("{not json"), []);
  assert.deepEqual(parseFavorites('{"images":["/a.jpg"]}'), []);
  assert.deepEqual(parseFavorites('["/a.jpg", 3, null, "/b.jpg", "/a.jpg", "javascript:x"]'), ["/a.jpg", "/b.jpg"]);
});

test("toggling adds once and removes without disturbing the rest", () => {
  assert.deepEqual(toggleFavorite([], "/a.jpg"), ["/a.jpg"]);
  assert.deepEqual(toggleFavorite(["/a.jpg"], "/b.jpg"), ["/a.jpg", "/b.jpg"]);
  assert.deepEqual(toggleFavorite(["/a.jpg", "/b.jpg", "/c.jpg"], "/b.jpg"), ["/a.jpg", "/c.jpg"]);
});
