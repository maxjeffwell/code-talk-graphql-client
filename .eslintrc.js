module.exports = {
	extends: "airbnb",
	plugins: ["react", "import", "graphql"],
	rules: {
		"react/jsx-filename-extension": 0,
		"react/prop-types": 0,
		"graphql/template-strings": ["error", {
		 env: "apollo",
			validators: "all"
		}],
	},
	globals: {
		document: 1,
	},
	parser: "babel-eslint",
	env: {
		browser: 1,
	},
};
