// @ts-check

/** @type {import("prettier").Config} */
export default {
  printWidth: 120, // Up to 120 characters per line
  tabWidth: 2, // indent with 2 spaces
  useTabs: false, // do not use indentation, but use spaces
  semi: true, // A semicolon is required at the end of the line
  singleQuote: true, // use single quotes
  quoteProps: 'as-needed', // the key of the object is only quoted when necessary
  jsxSingleQuote: false, // Jsx does not use single quotes, but double quotes
  trailingComma: 'none', // trailing comma is required
  bracketSpacing: true, // Spaces are required at the beginning and end of braces
  bracketSameLine: false, // The back angle brackets of JSX tags need to wrap
  arrowParens: 'avoid', // arrow function, when there is only one parameter, parentheses are also required
  rangeStart: 0, // The formatted range of each file is the entire content of the file
  rangeEnd: Number.POSITIVE_INFINITY,
  requirePragma: false, // don't need to write @prettier at the beginning of the file
  insertPragma: false, // don't need to automatically insert at the beginning of the file @prettier
  proseWrap: 'preserve', // use the default wrapping standard
  htmlWhitespaceSensitivity: 'ignore', // Determine whether to wrap html according to the display style
  vueIndentScriptAndStyle: false, // do not indent in script and style in Vue file
  endOfLine: 'lf', // newline character uses lf
  embeddedLanguageFormatting: 'auto', // format embedded content
  singleAttributePerLine: false // Each attribute in Html, vue, jsx occupies one line
};
