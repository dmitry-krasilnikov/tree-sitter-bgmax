# Description

Tree Sitter grammar for Bankgirot Receivables BgMax file format.

# Important information

This particular version of the parser is not specification compliant for a reason. These are the differences with the official technical specification from Bankgirot:

- `BGC serial number` and `company number` fields in record types TK20, TK21, TK22, TK23, TK29 allow for upper case letters to be present.

# TODO

- [ ] tests
- [ ] incorrectly formed file handling
- [ ] unknown records' handling
- [ ] handle negative amount in extra reference number record
