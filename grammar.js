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
    // TODO: figure out if it's possible to handle ISO-8859-1 encoding
    source_file: $ => seq(
      $.starting_record,
      $.catch_all_lines,
      $.end_record
    ),

    starting_record: $ => seq(
      '01',
      $.layout_name,
      $.layout_version,
      $.creation_timestamp,
      $.test_indicator,
      / {35}/
    ),

    transaction_code: $ => /[0-9]{2}/,

    layout_name: $ => /.{20}/,

    layout_version: $ => /.{2}/,

    creation_timestamp: $ => /[0-9]{20}/,

    test_indicator: $ => choice('T', 'P'),

    end_record: $ => seq(
      '70',
      field('number_of_payment_records', $.number_of),
      field('number_of_deduction_records', $.number_of),
      field('number_of_extra_reference_records', $.number_of),
      field('number_of_deposit_records', $.number_of),
      / {46}/
    ),

    number_of: $ => /[0-9]{8}/,

    catch_all_lines: $ => repeat1($.catch_all),

    catch_all: $=> /(05|2[0-9]|15).+/
  }
});
