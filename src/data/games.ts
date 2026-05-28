import { StaticImageData } from "next/image";

import coverKingmaker from "@/assets/pathfinder-kingmaker.jpg";
import coverWotr from "@/assets/pathfinder-wotr.jpg";
import coverBg1 from "@/assets/baldurs-gate-1.jpg";
import coverPoe from "@/assets/pillars-of-eternity.jpg";

export interface GameData {
  id: string;
  name: string;
  cover: StaticImageData;
}

export const GAMES: GameData[] = [
  {
    id: "pathfinder-kingmaker",
    name: "Pathfinder: Kingmaker",
    cover: coverKingmaker,
  },
  {
    id: "pathfinder-wotr",
    name: "Pathfinder: Wrath of the Righteous",
    cover: coverWotr,
  },
  {
    id: "baldurs-gate-1-2",
    name: "Baldur's Gate I & II",
    cover: coverBg1,
  },
  {
    id: "pillars-of-eternity",
    name: "Pillars of Eternity",
    cover: coverPoe,
  },
];
