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
      line: 2,
      column: 1,
      rule: "selector-no-qualifying-type",
      severity: "error",
      text: "Unexpected qualifying type selector (selector-no-qualifying-type)",
    },
    {
      line: 3,
      column: 3,
      rule: "declaration-property-value-whitelist",
      severity: "error",
      text: 'Give the unitless value for "line-height". See https://mzl.la/2TflJo5',
    },
  ]);
});

test("a11y", async () => {
  const result = await stylelint.lint({
    configFile: "index.js",
    code: `
.foo:focus {
  outline: 0;
}
`,
  });

  assert.equal(result.errored, true);
  assert.equal(result.results.length, 1);

  // HACK: Column is different between Node 10 and Node 12. Why…?
  let expectedColumn = 6;
  if (process.versions.node.startsWith("10.")) {
    expectedColumn = 5;
  }

  assert.deepEqual(result.results[0].warnings.sort(byLineAndColumn), [
    {
      line: 2,
      column: expectedColumn,
      rule: "a11y/no-outline-none",
      severity: "error",
      text: 'Unexpected using "outline" property in .foo:focus (a11y/no-outline-none)',
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
      line: 5,
      column: 3,
      rule: "order/order",
      severity: "error",
      text: "Expected custom property to come before $-variable (order/order)",
    },
    {
      line: 11,
      column: 3,
      rule: "order/order",
      severity: "error",
      text: "Expected declaration to come before at-rule (order/order)",
    },
  ]);
});
