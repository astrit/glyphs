import Box from "@/box";
import { styled } from "@/theme";
// https://graphemica.com/%5E
// https://graphemica.com/%5E
// https://graphemica.com/%5E
// https://graphemica.com/%5E
// https://graphemica.com/%5E
const Card = styled("li", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // borderRadius: "18px",
  aspectRatio: "1/1",
  objectFit: "cover",
  objectPosition: "center",
  fontWeight: "600",
  fontSize: "28px",
  lineHeight: "1",
  // background: "linear-gradient(hsl(261deg 80% 48%), hsl(261deg 80% 50%))",
  // color: "white",
  // border: "3px solid rgba(255,255,255,0.05)",
  // backgroundColor: "rgba(255,255,255,1)",
  color: "#0e0c1b",
  // boxShadow:
  //   "2px 3px 8px rgba(0, 0, 0, 0.06), 0px 28px 12px -8px rgba(0, 0, 0, 0.04)",
  // transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",

  userSelect: "none",
  position: "relative",
  cursor: "pointer",
  span: {
    transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transitionDelay: "0.1s",
  },
  "&:hover span": {
    scale: "1.4",
  },

  "&::before": {
    content: " ",
    position: "absolute",
    display: "flex",
    borderRadius: "18px",
    zIndex: "-1",
    boxShadow:
      "2px 3px 8px rgba(0, 0, 0, 0.06), 0px 28px 12px -8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    backgroundColor: "rgba(255,255,255,1)",
    width: "100%",
    height: "100%",
  },
  "&:hover::before": {
    scale: "1.1",
    borderRadius: "24px",
    cursor: "pointer",
  },
  "&:active::before": {
    scale: "0.9",
  },
});

const Cards = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
  gap: "24px",
  zIndex: "4",
});

const glfs = [
  "",
  "⌘",
  "♥",
  "◆",
  "●",
  "★",
  "⬓",
  "©",
  "®",
  "⁅",
  "⁆",
  "¦",
  "-",
  "–",
  "‒",
  "—",
  "―",
  "•",
  "◦",
  "‣",
  "⁌",
  "⁍",
  "·",
  "‥",
  "…",
  "‹",
  "›",
  "«",
  "»",
  "≤",
  "≥",
  "≠",
  "+",
  "−",
  "×",
  "÷",
  "±",
  "≈",
  "~",
  "¬",
  "†",
  "‡",
  "^",
  "®",
  "©",
  "℗",
  "™",
  "℠",
  "℡",
  "℻",
  "🅫",
  "🅪",
  "°",
  "¶",
  "⁋",
  "§",
  "∞",
  "∂",
  "∑",
  "∏",
  "∫",
  "√",
  "∅",
  "◊",
  "½",
  "⅓",
  "¼",
  "⅛",
  "⅟",
  "¾",
  "⅜",
  "⅚",
  "⅝",
  "⅞",
  "%",
  "‰",
  "‱",
  "⅍",
  "℆",
  "℅",
  "℀",
  "℁",
  "¨",
  "ˆ",
  "˜",
  "¯",
  "˘",
  "˙",
  "˚",
  "ˇ",
  "΅",
  "¸",
  "˛",
  "№",
  "℃",
  "℉",
  "Å",
  "ʘ",
  "℮",
  "←",
  "→",
  "⟵",
  "⟶",
  "⇐",
  "⇒",
  "⟸",
  "⟹",
  "↖",
  "↗",
  "↙",
  "↘",
  "↑",
  "↓",
  "↕",
  "↔",
  "⟷",
  "⇔",
  "⟺",
  "↰",
  "↱",
  "↵",
  "↳",
  "↴",
  "⏎",
  "⇤",
  "⇥",
  "⇞",
  "⇟",
  "↺",
  "↻",
  "⎋",
  "↩",
  "↪",
  "✓",
  "✗",
  "▲",
  "▼",
  "◄",
  "▶",
  "△",
  "▽",
  "◅",
  "▻",
  "⚠",
  "●",
  "○",
  "■",
  "□",
  "▢",
  "⬒",
  "⬓",
  "◆",
  "◇",
  "❖",
  "☀",
  "☼",
  "♥",
  "♡",
  "❤",
  "★",
  "☆",
  "⬆",
  "⇧",
  "⇪",
  "⌘",
  "⌃",
  "⌅",
  "⌥",
  "⎇",
  "⌫",
  "⌦",
  "⌧",
  "⏏",
  "◯",
  "⬜",
  "Ⓐ",
  "Ⓑ",
  "Ⓒ",
  "Ⓓ",
  "Ⓔ",
  "Ⓕ",
  "Ⓖ",
  "Ⓗ",
  "Ⓘ",
  "Ⓙ",
  "Ⓚ",
  "Ⓛ",
  "Ⓜ",
  "Ⓝ",
  "Ⓞ",
  "Ⓟ",
  "Ⓠ",
  "Ⓡ",
  "Ⓢ",
  "Ⓣ",
  "Ⓤ",
  "Ⓥ",
  "Ⓦ",
  "Ⓧ",
  "Ⓨ",
  "Ⓩ",
  "⓪",
  "➀",
  "➁",
  "➂",
  "➃",
  "➄",
  "➅",
  "➆",
  "➇",
  "➈",
  "🄰",
  "🄱",
  "🄲",
  "🄳",
  "🄴",
  "🄵",
  "🄶",
  "🄷",
  "🄸",
  "🄹",
  "🄺",
  "🄻",
  "🄼",
  "🄽",
  "🄾",
  "🄿",
  "🅀",
  "🅁",
  "🅂",
  "🅃",
  "🅄",
  "🅅",
  "🅆",
  "🅇",
  "🅈",
  "🅉",
  "¤",
  "₣",
  "₾",
  "₨",
  "₼",
  "₪",
  "₥",
  "₯",
  "₮",
  "₢",
  "₵",
  "₡",
  "₲",
  "₦",
  "₴",
  "₳",
  "₤",
  "₩",
  "₭",
  "₱",
  "₧",
  "₸",
  "₹",
  "€",
  "₽",
  "₺",
  "ƒ",
  "£",
  "¥",
  "¢",
  "$",
];

function Cardz(props) {
  const glfs = props.glfs;
  const glf = glfs.map((glf) => {
    return (
      <Card
        key={glf}
        onClick={() => {
          navigator.clipboard.writeText(glf);
          // splitbee.track("Copy", { Glyph: glf });
        }}
        data-name={glf}
      >
        <span>{glf}</span>
      </Card>
    );
  });
  return (
    <div>
      <Box
        css={{
          fontSize: "14px",
          marginBottom: "40px",
          opacity: "0.6",
        }}
      >
        <div>
          {glf.length} handpicker Glyphs for easy access, copy and paste
        </div>
        <div>Shift + Click to copy</div>
      </Box>
      <Cards>{glf}</Cards>
    </div>
  );
}

export default function Glyphs() {
  return <Cardz glfs={glfs} />;
}
