module.exports = {
	extends: [
		"react-app",
		"react-app/jest"
	],
	plugins: ['graphql'],
	rules: {
		"react/jsx-filename-extension": 0,
		"graphql/template-strings": ["error", {
		 env: "apollo",
			validators: "all"
		}],
		"react/prop-types": 0
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true
	},
};
