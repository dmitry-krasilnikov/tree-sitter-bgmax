/**
 * @file Bgmax grammar for tree-sitter
 * @author Dmitry Krasilnikov <krasilnikovdo@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "bgmax",

  externals: $ => [$.payee_plusgiro_number, $.reference, $.information_text, $.payer_info, $.payer_post_code, $.payer_country_code],

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
      repeat1(choice($.payment, $.deduction)),
      $.section_deposit_record
    ),

    payment: $ => seq(
      $.payment_record,
      repeat($.extra_reference_number_record),
      repeat($.payment_information_record),
      optional($.name_record),
      optional($.address_record_1),
      optional($.address_record_2),
      optional($.company_number_record)
    ),

    deduction: $ => seq(
      $.deduction_record,
      repeat($.extra_reference_number_record),
      repeat($.payment_information_record),
      optional($.name_record),
      optional($.address_record_1),
      optional($.address_record_2),
      optional($.company_number_record)
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

    long_numeric_field: $ => /[A-Z0-9]{12}/,

    payment_record: $ => seq(
      '20',
      field('payer_bankgiro_number', $.bankgiro_number),
      $.reference,
      field('payment_amount', $.amount),
      field('reference_code', $.single_digit_code),
      field('payment_channel_code', $.single_digit_code),
      field('bgc_serial_number', $.long_numeric_field),
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
      field('bgc_serial_number', $.long_numeric_field),
      field('image_marking', $.single_digit_code),
      field('deduction_code', $.single_digit_code),
      / {9}/
    ),

    extra_reference_number_record: $ => seq(
      /2[2-3]/,
      field('payer_bankgiro_number', $.bankgiro_number),
      $.reference,
      field('payment_amount', $.amount),
      field('reference_code', $.single_digit_code),
      field('payment_channel_code', $.single_digit_code),
      field('bgc_serial_number', $.long_numeric_field),
      field('image_marking', $.single_digit_code),
      / {10}/
    ),

    payment_information_record: $ => seq(
      '25',
      $.information_text,
      / {28}/
    ),

    name_record: $ => seq(
      '26',
      field('payer_name', $.payer_info),
      field('extra_name_field', $.payer_info),
      / {8}/
    ),

    address_record_1: $ => seq(
      '27',
      field('payer_address', $.payer_info),
      $.payer_post_code,
      / {34}/
    ),

    address_record_2: $ => seq(
      '28',
      field('payer_town', $.payer_info),
      field('payer_country', $.payer_info),
      $.payer_country_code,
      / {6}/
    ),

    company_number_record: $ => seq(
      '29',
      field('company_number', $.long_numeric_field),
      / {66}/
    ),
  }
});
