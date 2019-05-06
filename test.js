const stylelint = require("stylelint");
const test = require("tape");

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

const lint = code => stylelint.lint({ configFile: "index.js", code: code.trimStart() });

test("rules", async t => {
  const result = await lint(`
a.cls {
  line-height: 1.5em;
}
`);

  t.is(result.errored, true);
  t.is(result.results.length, 1);
  t.deepEqual(result.results[0].warnings.sort(byLineAndColumn), [
    {
      line: 1,
      column: 1,
      rule: "selector-no-qualifying-type",
      severity: "error",
      text: "Unexpected qualifying type selector (selector-no-qualifying-type)",
    },
    {
      line: 2,
      column: 3,
      rule: "declaration-property-value-whitelist",
      severity: "error",
      text: 'Give the unitless value for "line-height". See https://mzl.la/2TflJo5',
    },
  ]);
  t.end();
});

test("a11y", async t => {
  const result = await lint(`
.foo:focus {
  outline: 0;
}
`);

  t.is(result.errored, true);
  t.is(result.results.length, 1);
  t.deepEqual(result.results[0].warnings.sort(byLineAndColumn), [
    {
      line: 1,
      column: 5,
      rule: "a11y/no-outline-none",
      severity: "error",
      text: 'Unexpected using "outline" property in .foo:focus (a11y/no-outline-none)',
    },
  ]);
  t.end();
});
