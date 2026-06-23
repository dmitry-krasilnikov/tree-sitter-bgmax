/**
 * @file Bgmax grammar for tree-sitter
 * @author Dmitry Krasilnikov <krasilnikovdo@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "bgmax",

  externals: $ => [$.payee_plusgiro_number, $.reference],

  rules: {
    // TODO: figure out if it's possible to handle ISO-8859-1 encoding
    source_file: $ => seq(
      $.file_opening_record,
      repeat1($.section),
      $.file_end_record
    ),

    file_opening_record: $ => seq(
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
      $.section_opening_record,
      $.catch_all_lines,
      $.section_deposit_record
    ),

    // TODO: try to figure out why section parsing breaks when the pattern does not include whitespace char
    currency_code: $ => /[ A-Z]{3}/,

    section_opening_record: $ => seq(
      '05',
      field('payee_bankgiro_number', $.bankgiro_number),
      $.payee_plusgiro_number,
      $.currency_code,
      / {55}/
    ),

    bankgiro_number: $ => /[0-9]{10}/,

    section_deposit_record: $ => seq(
      '15',
      $.payee_bank_account_number,
      $.payment_date,
      $.deposit_serial_number,
      field('deposit_amount', $.amount),
      $.currency_code,
      field('number_of_payments', $.number_of),
      $.type_of_deposit,
    ),

    payee_bank_account_number: $ => /[0-9]{35}/,

    payment_date: $ => /[0-9]{8}/,

    deposit_serial_number: $ => /[0-9]{5}/,

    amount: $ => /[0-9]{18}/,

    type_of_deposit: $ => choice('K', 'D', ' '),

    file_end_record: $ => seq(
      '70',
      field('number_of_payment_records', $.number_of),
      field('number_of_deduction_records', $.number_of),
      field('number_of_extra_reference_records', $.number_of),
      field('number_of_deposit_records', $.number_of),
      / {46}/
    ),

    number_of: $ => /[0-9]{8}/,

    single_digit_code: $ => /[0-9]{1}/,

    bgc_serial_number: $ => /[0-9]{12}/,

    payment_record: $ => seq(
      '20',
      field('payer_bankgiro_number', $.bankgiro_number),
      $.reference,
      field('payment_amount', $.amount),
      field('reference_code', $.single_digit_code),
      field('payment_channel_code', $.single_digit_code),
      $.bgc_serial_number,
      field('image_marking', $.single_digit_code),
      / {10}/
    ),

    deduction_record: $ => seq(
      '21',
      field('payer_bankgiro_number', $.bankgiro_number),
      $.reference,
      field('payment_amount', $.amount),
      field('reference_code', $.single_digit_code),
      field('payment_channel_code', $.single_digit_code),
      $.bgc_serial_number,
      field('image_marking', $.single_digit_code),
      field('deduction_code', $.single_digit_code),
      / {9}/
    ),

    catch_all_lines: $ => repeat1(choice($.payment_record, $.deduction_record, $.catch_all)),

    catch_all: $=> /2[2-9].{78}/
  }
});
