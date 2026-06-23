#include "tree_sitter/parser.h"
#include "tree_sitter/alloc.h"
#include "tree_sitter/array.h"

enum TokenType {
    PAYEE_PLUSGIRO_NUMBER,
    REFERENCE,
    INFORMATION_TEXT,
    PAYER_NAME,
};

void * tree_sitter_bgmax_external_scanner_create() {
    return NULL;
}

void tree_sitter_bgmax_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_bgmax_external_scanner_serialize(
  void *payload,
  char *buffer
) {
    return 0;
}

void tree_sitter_bgmax_external_scanner_deserialize(
  void *payload,
  const char *buffer,
  unsigned length
) {}

bool tree_sitter_bgmax_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
    if (valid_symbols[PAYEE_PLUSGIRO_NUMBER]) {
        for (int i = 0; i < 10; i++) {
            lexer->advance(lexer, false);
        }
        lexer->result_symbol = PAYEE_PLUSGIRO_NUMBER;
        return true;
    } else if (valid_symbols[REFERENCE]) {
        for (int i = 0; i < 25; i++) {
            lexer->advance(lexer, false);
        }
        lexer->result_symbol = REFERENCE;
        return true;
    } else if (valid_symbols[INFORMATION_TEXT]) {
        for (int i = 0; i < 50; i++) {
            lexer->advance(lexer, false);
        }
        lexer->result_symbol = INFORMATION_TEXT;
        return true;
    } else if (valid_symbols[PAYER_NAME]) {
        for (int i = 0; i < 35; i++) {
            lexer->advance(lexer, false);
        }
        lexer->result_symbol = PAYER_NAME;
        return true;
    }
    return false;
}
