module.exports = {
	extends: ["airbnb", "prettier"],
	plugins: ['react', 'jsx-a11y', 'import', 'graphql', 'prettier'],
	rules: {
		"react/jsx-filename-extension": 0,
		"graphql/template-strings": ["error", {
		 env: "apollo",
			validators: "all"
		}],
		"react/prop-types": 0,
		"prettier/prettier": ["error"]
	},
	parser: "babel-eslint",
	env: {
		browser: 1,
	},
};
