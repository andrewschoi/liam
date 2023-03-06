const {
  removeNestedWords,
  delimitWords,
  truncateWords,
} = require("./Processing");

describe("removeNestedWords", () => {
  test("empty list", () => {
    const wordList = [];
    const ans = removeNestedWords(wordList);
    expect(ans).toEqual([]);
  });

  test("empty string list", () => {
    const wordList = [""];
    const ans = removeNestedWords(wordList);
    expect(ans).toEqual([]);
  });

  test("spaces string list", () => {
    const wordList = [" ", "", " "];
    const ans = removeNestedWords(wordList);
    expect(ans).toEqual([]);
  });

  test("one string list", () => {
    const wordList = [" ", "cheese", " "];
    const ans = removeNestedWords(wordList);
    expect(ans).toEqual(["cheese"]);
  });

  test("flatten word list", () => {
    const wordList = ["computer", "vision", "is hard"];
    const ans = removeNestedWords(wordList);
    expect(ans).toEqual(["computer", "vision", "is", "hard"]);
  });

  test("flatten word list", () => {
    const wordList = ["wings", "", "over ithaca", " "];
    const ans = removeNestedWords(wordList);
    expect(ans).toEqual(["wings", "over", "ithaca"]);
  });

  test("multiple word list", () => {
    const wordList = ["cheese mouse or big mouse"];
    const ans = removeNestedWords(wordList);
    expect(ans).toEqual(["cheese", "mouse", "or", "big", "mouse"]);
  });
});

describe("delimitWords", () => {
  test("empty list", () => {
    const wordList = [];
    const ans = delimitWords(wordList, "!");
    expect(ans).toEqual([]);
  });

  test("punctuation word", () => {
    const wordList = ["garfield!"];
    const ans = delimitWords(wordList, "a");
    expect(ans).toEqual(["garfield!", "a"]);
  });
});
