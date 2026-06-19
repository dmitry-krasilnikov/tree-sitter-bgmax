package tree_sitter_bgmax_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bgmax "github.com/tree-sitter/tree-sitter-bgmax/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bgmax.Language())
	if language == nil {
		t.Errorf("Error loading BgMax (Bankgiro Receivables) grammar for tree-sitter grammar")
	}
}
