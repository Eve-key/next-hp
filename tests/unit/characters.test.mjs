import { test } from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { characters, findCharacter, characterNeighbors } from "../../app/characters.ts";

test("profiles have unique route IDs and distinct existing portraits", async () => {
  assert.equal(characters.length, 4);
  assert.equal(new Set(characters.map(({ id }) => id)).size, 4);
  assert.equal(new Set(characters.map(({ image }) => image)).size, 4);

  for (const character of characters) {
    assert.match(character.id, /^[a-z]+$/);
    assert.equal(findCharacter(character.id), character);
    await access(new URL(`../../public${character.image}`, import.meta.url));
  }
});

test("an unrecognized ID does not match a character", () => {
  assert.equal(findCharacter("missing"), undefined);
  assert.equal(findCharacter("__proto__"), undefined);
  assert.equal(characterNeighbors("missing"), undefined);
});

test("next and previous portraits follow the character order, wrapping at both ends", () => {
  const [first, second, , last] = characters;
  assert.deepEqual(characterNeighbors(first.id), { previous: last, next: second });
  assert.equal(characterNeighbors(last.id).next, first);
  assert.equal(characterNeighbors(second.id).previous, first);
});
