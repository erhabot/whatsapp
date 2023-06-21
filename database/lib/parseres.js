const botinfo = {
  botname: "Yanfei",
  unicode: {
    head: "⬣",
    list: "⬡",
    body: "┃",
    upper: "┏",
    down: "┗",
    line: "━",
    wings: ["𓆩 ", " 𓆪"],
    needed: ["<", ">"],
    optional: ["(", ")"],
  },
};

module.exports = function parseResult(json, options = {}) {
  const { botname, unicode } = botinfo;
  const {
    list,
    head,
    upper,
    down,
    line,
    wings,
    needed,
    optional,
  } = unicode;
  const {
    title = botname,
    ignoreVal = [null, undefined],
    ignoreKey = [],
  } = options;

  const headers = `${head}${line.repeat(4)}${list} _*${title}*_`;
  const body = `${list} *%key*: _%value_`;
  const footer = `${head}${line}${line}${line}${list}\n`;

  const obj = Object.entries(json);
  const tmp = [];
  for (const [_key, val] of obj) {
    if (ignoreVal.includes(val)) continue;
    const key = _key[0].toUpperCase() + _key.slice(1);
    const type = typeof val;
    if (ignoreKey.includes(_key)) continue;
    switch (type) {
      case "boolean":
        tmp.push([key, val ? "Ya" : "Tidak"]);
        break;
      case "object":
        if (Array.isArray(val)) {
          tmp.push([key, val.join(", ")]);
        } else {
          tmp.push([
            key,
            parseResult(val, {
              ignoreKey,
              unicode: false,
            }),
          ]);
        }
        break;
      default:
        tmp.push([key, val]);
        break;
    }
  }

  if (unicode) {
    const text = [
      headers.replace(/%title/g, title),
      tmp
        .map((v) => {
          return body.replace(/%key/g, v[0]).replace(/%value/g, v[1]);
        })
        .join("\n"),
      footer,
    ];
    return text.join("\n").trim();
  }
  
  return tmp;
};