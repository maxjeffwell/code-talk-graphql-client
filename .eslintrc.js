module.exports = {
	extends: [
		"react-app",
		"react-app/jest"
	],
	rules: {
		"react/jsx-filename-extension": 0,
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
