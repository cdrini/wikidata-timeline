CodeMirror.defineSimpleMode("simplemode", {
  // The start state contains the rules that are intially used
  start: [
    {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
    // You can match multiple tokens at once. Note that the captured
    // groups must span the whole string in this case
    // {regex: /(function)(\s+)([a-z$][\w$]*)/, token: ["keyword", null, "variable-2"]},
    // Rules are matched in the order in which they appear, so there is
    // no ambiguity between this one and the one above
    {regex: /(?:noclaim|claim|tree|web|string|between|quantity|items|link)\b/i,
     token: "keyword"},
    {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
     token: "number"},
    {regex: /(?:and|or)\b/i, token: "operator"},
  ]
});
