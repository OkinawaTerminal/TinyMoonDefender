module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "env": {
      "browser": true
    },
    "rules": {
      "max-len": "off",
      "semi": ["error", "never"],
      "comma-dangle": ["error", "never"],
      "class-methods-use-this": "off",
      "curly": "off",
      "space-before-function-paren": ["error", "never"],
      "no-plusplus": "off",
      "no-mixed-operators": "off",
      "no-param-reassign": ["error", { "props": false }]
    }
};
