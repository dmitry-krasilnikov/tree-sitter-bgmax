import XCTest
import SwiftTreeSitter
import TreeSitterBgmax

final class TreeSitterBgmaxTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bgmax())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading BgMax (Bankgiro Receivables) grammar for tree-sitter grammar")
    }
}
