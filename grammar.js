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
      repeat1($.section),
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

    layout_name: $ => /.{20}/,

    layout_version: $ => /.{2}/,

    creation_timestamp: $ => /[0-9]{20}/,

    test_indicator: $ => choice('T', 'P'),

    section: $ => seq(
      $.opening_record,
      $.catch_all_lines,
      $.deposit_record
    ),

    // TODO: try to figure out why section parsing breaks when the pattern does not include whitespace char
    currency_code: $ => /[ A-Z]{3}/,

    opening_record: $ => seq(
      '05',
      $.payee_bankgiro_number,
      $.payee_plusgiro_number,
      $.currency_code,
      / {55}/
    ),

    payee_bankgiro_number: $ => /[0-9]{10}/,

    payee_plusgiro_number: $ => /[ a-zA-Z0-9]{10}/,

    deposit_record: $ => seq(
      '15',
      $.payee_bank_account_number,
      $.payment_date,
      $.deposit_serial_number,
      $.deposit_amount,
      $.currency_code,
      field('number_of_payments', $.number_of),
      $.type_of_deposit,
    ),

    payee_bank_account_number: $ => /[0-9]{35}/,

    payment_date: $ => /[0-9]{8}/,

    deposit_serial_number: $ => /[0-9]{5}/,

    deposit_amount: $ => /[0-9]{18}/,

    type_of_deposit: $ => choice('K', 'D', ' '),

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

    catch_all: $=> /2[0-9].{78}/
  }
});
