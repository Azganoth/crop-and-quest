import { StaticImageData } from "next/image";

import coverKingmaker from "@/assets/pathfinder-kingmaker.jpg";
import coverWotr from "@/assets/pathfinder-wotr.jpg";
import coverBg1 from "@/assets/baldurs-gate-1.jpg";
import coverBg2 from "@/assets/baldurs-gate-2.jpg";
import coverPoe from "@/assets/pillars-of-eternity.jpg";
import coverPoe2 from "@/assets/pillars-of-eternity2.jpg";

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
    id: "baldurs-gate-1",
    name: "Baldur's Gate I (Enhanced Edition)",
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
    name: "Baldur's Gate II (Enhanced Edition)",
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
];
