module.exports = {
	extends: ["airbnb", "plugin:prettier/recommended"],
	rules: {
		"react/jsx-filename-extension": 0,
		"graphql/template-strings": ["error", {
		 env: "apollo",
			validators: "all"
		}],
		"react/prop-types": 0,
	},
	globals: {
		document: 1,
	},
	parser: "babel-eslint",
	env: {
		browser: 1,
	},
};
