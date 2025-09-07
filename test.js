const assert = require("node:assert/strict");
const test = require("node:test");

const stylelint = require("stylelint");

const byLineAndColumn = (a, b) => {
  if (a.line < b.line) {
    return -1;
  }
  if (a.line > b.line) {
    return 1;
  }
  if (a.column < b.column) {
    return -1;
  }
  if (a.column > b.column) {
    return 1;
  }
  return 0;
};

test("rules", async () => {
  const result = await stylelint.lint({
    configFile: "index.js",
    code: `
a.cls {
  line-height: 1.5em;
}
`,
  });

  assert.equal(result.errored, true);
  assert.equal(result.results.length, 1);
  assert.deepEqual(result.results[0].warnings.sort(byLineAndColumn), [
    {
      line: 1,
      column: 1,
      endLine: 5,
      endColumn: 2,
      rule: "declaration-property-value-whitelist",
      severity: "error",
      text: "Unknown rule declaration-property-value-whitelist.",
      url: undefined,
      fix: undefined,
    },
    {
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 6,
      rule: "selector-no-qualifying-type",
      severity: "error",
      text: 'Unexpected qualifying type selector "a.cls" (selector-no-qualifying-type)',
      url: undefined,
      fix: undefined,
    },
  ]);
});

test("order", async () => {
  const result = await stylelint.lint({
    configFile: "index.js",
    code: `
a {
  $foo: 1px;

  --height: 10px;

  span { /* empty */ }

  @media (min-width: 100px) { /* empty */ }

  color: pink;
}
`,
  });

  assert.equal(result.errored, true);
  assert.equal(result.results.length, 1);

  assert.deepEqual(result.results[0].warnings.sort(byLineAndColumn), [
    {
      line: 1,
      column: 1,
      endLine: 13,
      endColumn: 2,
      rule: "declaration-property-value-whitelist",
      severity: "error",
      text: "Unknown rule declaration-property-value-whitelist.",
      url: undefined,
      fix: undefined,
    },
    {
      line: 5,
      column: 3,
      endLine: 5,
      endColumn: 18,
      rule: "order/order",
      severity: "error",
      text: "Expected custom property to come before $-variable (order/order)",
      url: undefined,
      fix: undefined,
    },
    {
      line: 9,
      column: 10,
      endLine: 9,
      endColumn: 28,
      rule: "media-feature-range-notation",
      severity: "error",
      text: 'Expected "context" media feature range notation (media-feature-range-notation)',
      url: undefined,
      fix: undefined,
    },
    {
      line: 11,
      column: 3,
      endLine: 11,
      endColumn: 15,
      rule: "order/order",
      severity: "error",
      text: "Expected declaration to come before at-rule (order/order)",
      url: undefined,
      fix: undefined,
    },
  ]);
});
