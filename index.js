module.exports = {
  extends: ["stylelint-config-standard", "stylelint-a11y/recommended"],

  plugins: ["stylelint-order"],

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

    // eslint-disable-next-line sort-keys
    "order/order": ["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"],
  },
};
