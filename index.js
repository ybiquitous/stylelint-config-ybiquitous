/* eslint sort-keys: "error" */
module.exports = {
  extends: ["stylelint-config-standard"],

  rules: {
    "declaration-property-value-whitelist": [
      {
        "line-height": ["/^[0-9.]+$/"],
      },
      {
        message: 'Give the unitless value for "line-height". See https://mzl.la/2TflJo5',
      },
    ],
    "selector-no-qualifying-type": true,
  },
};
