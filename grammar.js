/**
 * @file Bgmax grammar for tree-sitter
 * @author Dmitry Krasilnikov <krasilnikovdo@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "bgmax",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
