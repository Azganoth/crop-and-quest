import { StaticImageData } from "next/image";

import coverKingmaker from "@/assets/pathfinder-kingmaker.jpg";
import coverWotr from "@/assets/pathfinder-wotr.jpg";
import coverBg1 from "@/assets/baldurs-gate-1.jpg";
import coverBg2 from "@/assets/baldurs-gate-2.jpg";
import coverPoe from "@/assets/pillars-of-eternity.jpg";
import coverPoe2 from "@/assets/pillars-of-eternity2.jpg";
import coverArcanum from "@/assets/arcanum.jpg";
import coverBlackGeyser from "@/assets/black-geyser.webp";
import coverIwd1 from "@/assets/icewind-dale.jpg";
import coverIwd2 from "@/assets/icewind-dale-2.png";
import coverNwn1 from "@/assets/neverwinter-nights-1.jpg";
import coverNwn2 from "@/assets/neverwinter-nights-2.jpg";
import coverPlanescape from "@/assets/planescape-torment.png";
import coverRogueTrader from "@/assets/rogue-trader.jpg";
import coverSrReturns from "@/assets/shadowrun-returns.jpg";
import coverSrDragonfall from "@/assets/shadowrun-dragonfall.jpg";
import coverSrHongKong from "@/assets/shadowrun-hong-kong.jpg";
import coverTyranny from "@/assets/tyranny.jpg";
import coverWasteland2 from "@/assets/wasteland-2.jpg";
import coverWasteland3 from "@/assets/wasteland-3.jpg";

export interface PortraitVariant {
  key: string;
  label: string;
  width: number;
  height: number;
  format: "png" | "jpeg" | "webp" | "bmp" | "tga";
  quality?: number;
  filename: string;
  optional?: boolean;
}

export interface GamePreset {
  id: string;
  name: string;
  description?: string;
  cover: StaticImageData;
  variants: PortraitVariant[];
  installNotes?: string;
  sourceUrl?: string;
}

export const GAMES: GamePreset[] = [
  {
    id: "pathfinder-kingmaker",
    name: "Pathfinder: Kingmaker",
    cover: coverKingmaker,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 692,
        height: 1024,
        format: "png",
        filename: "Fulllength.png",
      },
      {
        key: "medium",
        label: "Medium",
        width: 330,
        height: 432,
        format: "png",
        filename: "Medium.png",
      },
      {
        key: "small",
        label: "Small",
        width: 185,
        height: 242,
        format: "png",
        filename: "Small.png",
      },
    ],
  },
  {
    id: "pathfinder-wotr",
    name: "Pathfinder: Wrath of the Righteous",
    cover: coverWotr,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 692,
        height: 1024,
        format: "png",
        filename: "Fulllength.png",
      },
      {
        key: "medium",
        label: "Medium",
        width: 330,
        height: 432,
        format: "png",
        filename: "Medium.png",
      },
      {
        key: "small",
        label: "Small",
        width: 185,
        height: 242,
        format: "png",
        filename: "Small.png",
      },
    ],
  },
  {
    id: "rogue-trader",
    name: "Warhammer 40,000: Rogue Trader",
    cover: coverRogueTrader,
    variants: [
      {
        key: "large",
        label: "Full Length",
        width: 692,
        height: 1024,
        format: "png",
        filename: "Fulllength.png",
      },
      {
        key: "medium",
        label: "Medium",
        width: 330,
        height: 432,
        format: "png",
        filename: "Medium.png",
      },
      {
        key: "small",
        label: "Small",
        width: 185,
        height: 242,
        format: "png",
        filename: "Small.png",
      },
    ],
  },
  {
    id: "pillars-of-eternity",
    name: "Pillars of Eternity",
    cover: coverPoe,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "png",
        filename: "portrait_lg.png",
      },
      {
        key: "small",
        label: "Small",
        width: 76,
        height: 96,
        format: "png",
        filename: "portrait_sm.png",
      },
    ],
  },
  {
    id: "pillars-of-eternity-2",
    name: "Pillars of Eternity II: Deadfire",
    cover: coverPoe2,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "png",
        filename: "portrait_lg.png",
      },
      {
        key: "small",
        label: "Small",
        width: 76,
        height: 96,
        format: "png",
        filename: "portrait_sm.png",
      },
    ],
  },
  {
    id: "baldurs-gate-1",
    name: "Baldur's Gate I",
    cover: coverBg1,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "PORTRAITL.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "PORTRAITM.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "PORTRAITS.bmp",
      },
    ],
  },
  {
    id: "baldurs-gate-2",
    name: "Baldur's Gate II",
    cover: coverBg2,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "PORTRAITL.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "PORTRAITM.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "PORTRAITS.bmp",
      },
    ],
  },
  {
    id: "tyranny",
    name: "Tyranny",
    cover: coverTyranny,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "png",
        filename: "portrait_lg.png",
      },
      {
        key: "small",
        label: "Small",
        width: 76,
        height: 96,
        format: "png",
        filename: "portrait_sm.png",
      },
    ],
  },
  {
    id: "icewind-dale-1",
    name: "Icewind Dale I",
    cover: coverIwd1,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "PORTRAITL.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "PORTRAITM.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "PORTRAITS.bmp",
      },
    ],
  },
  {
    id: "icewind-dale-2",
    name: "Icewind Dale II",
    cover: coverIwd2,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "PORTRAITL.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 42,
        height: 42,
        format: "bmp",
        filename: "PORTRAITS.bmp",
      },
    ],
  },
  {
    id: "shadowrun-returns",
    name: "Shadowrun Returns",
    cover: coverSrReturns,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 212,
        height: 278,
        format: "png",
        filename: "custom_portrait.png",
      },
    ],
  },
  {
    id: "shadowrun-dragonfall",
    name: "Shadowrun: Dragonfall",
    cover: coverSrDragonfall,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 212,
        height: 278,
        format: "png",
        filename: "custom_portrait.png",
      },
    ],
  },
  {
    id: "shadowrun-hong-kong",
    name: "Shadowrun: Hong Kong",
    cover: coverSrHongKong,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 212,
        height: 278,
        format: "png",
        filename: "custom_portrait.png",
      },
    ],
  },
  {
    id: "neverwinter-nights",
    name: "Neverwinter Nights",
    cover: coverNwn1,
    variants: [
      {
        key: "huge",
        label: "Huge",
        width: 256,
        height: 512,
        format: "tga",
        filename: "custom_h.tga",
      },
      {
        key: "large",
        label: "Large",
        width: 128,
        height: 256,
        format: "tga",
        filename: "custom_l.tga",
      },
      {
        key: "medium",
        label: "Medium",
        width: 64,
        height: 128,
        format: "tga",
        filename: "custom_m.tga",
      },
      {
        key: "small",
        label: "Small",
        width: 32,
        height: 64,
        format: "tga",
        filename: "custom_s.tga",
      },
      {
        key: "tiny",
        label: "Tiny",
        width: 16,
        height: 32,
        format: "tga",
        filename: "custom_t.tga",
      },
    ],
  },
  {
    id: "neverwinter-nights-2",
    name: "Neverwinter Nights 2",
    cover: coverNwn2,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 128,
        height: 128,
        format: "tga",
        filename: "custom.tga",
      },
    ],
  },
  {
    id: "planescape-torment",
    name: "Planescape: Torment",
    cover: coverPlanescape,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "PORTRAITL.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "PORTRAITS.bmp",
      },
    ],
  },
  {
    id: "wasteland-2",
    name: "Wasteland 2",
    cover: coverWasteland2,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 256,
        height: 256,
        format: "png",
        filename: "custom_portrait.png",
      },
    ],
  },
  {
    id: "wasteland-3",
    name: "Wasteland 3",
    cover: coverWasteland3,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 256,
        height: 256,
        format: "png",
        filename: "custom_portrait.png",
      },
    ],
  },
  {
    id: "arcanum",
    name: "Arcanum: Of Steamworks and Magick Obscura",
    cover: coverArcanum,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 128,
        height: 128,
        format: "bmp",
        filename: "custom_b.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 64,
        height: 64,
        format: "bmp",
        filename: "custom.bmp",
      },
    ],
  },
  {
    id: "black-geyser",
    name: "Black Geyser: Couriers of Darkness",
    cover: coverBlackGeyser,
    variants: [
      {
        key: "large",
        label: "Large",
        width: 182,
        height: 216,
        format: "png",
        filename: "male_custom.png",
      },
    ],
  },
];
