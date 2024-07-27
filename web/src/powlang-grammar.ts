const powLangGrammar: any = {
  keyword: /\b(?:define|number|string|show)\b/,
  boolean: /\b(?:true|false)\b/,
  operator: /=e|=s|=i|[+*\/><=-]/,
  number: /\b\d+\b/,
  string: /"(?:[^"\\]|\\.)*"/,
  identifier: /\b[a-zA-Z_]\w*\b/,
  punctuation: /[()]/,
  comment: /#.*/,
};

export default powLangGrammar;
