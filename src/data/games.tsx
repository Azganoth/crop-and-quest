import { StaticImageData } from "next/image";
import React from "react";

import coverArcanum from "@/assets/arcanum.jpg";
import coverBg1 from "@/assets/baldurs-gate-1.jpg";
import coverBg2 from "@/assets/baldurs-gate-2.jpg";
import coverBlackGeyser from "@/assets/black-geyser.webp";
import coverIwd2 from "@/assets/icewind-dale-2.png";
import coverIwd1 from "@/assets/icewind-dale.jpg";
import coverNwn1 from "@/assets/neverwinter-nights-1.jpg";
import coverNwn2 from "@/assets/neverwinter-nights-2.jpg";
import coverKingmaker from "@/assets/pathfinder-kingmaker.jpg";
import coverWotr from "@/assets/pathfinder-wotr.jpg";
import coverPoe from "@/assets/pillars-of-eternity.jpg";
import coverPoe2 from "@/assets/pillars-of-eternity2.jpg";
import coverPlanescape from "@/assets/planescape-torment.png";
import coverRogueTrader from "@/assets/rogue-trader.jpg";
import coverSrDragonfall from "@/assets/shadowrun-dragonfall.jpg";
import coverSrHongKong from "@/assets/shadowrun-hong-kong.jpg";
import coverSrReturns from "@/assets/shadowrun-returns.jpg";
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
  installNotes?: React.ReactNode;
  sourceUrl?: string;
}

const OwlcatNotes = ({ path }: { path: string }) => (
  <>
    <p>
      <strong>Option 1: In-Game Setup</strong>
    </p>
    <ul className="list-inside list-disc space-y-1">
      <li>
        In the character creator, select <strong>Custom Portrait</strong> and click{" "}
        <strong>Open portrait folder</strong>.
      </li>
      <li>
        The game will automatically generate a new numbered folder (e.g., <strong>0000</strong>,{" "}
        <strong>0001</strong>).
      </li>
      <li>Replace the placeholder files inside this new folder with your downloaded PNGs.</li>
    </ul>

    <p className="mt-4">
      <strong>Option 2: Manual Setup</strong>
    </p>
    <ul className="list-inside list-disc space-y-1">
      <li>Navigate to the portraits directory:</li>
      <pre className="mt-2!">{path}</pre>
      <li>
        Create a new numbered folder (e.g., <strong>0001</strong>, <strong>0002</strong>) matching
        the expected sequence.
      </li>
      <li>Place your downloaded PNGs inside this specific folder.</li>
    </ul>
  </>
);

const InfinityEngineNotes = ({ path }: { path: string }) => (
  <>
    <p>
      Extract your downloaded PNGs into the <strong>portraits</strong> folder within your Documents
      directory (create the folder if it does not exist):
    </p>
    <pre>{path}</pre>
    <p>
      In-game, select the <strong>Custom</strong> button during character creation.
    </p>
    <p>
      <strong>Note:</strong> You can rename the base files, but the base name cannot exceed 7
      characters, and you must keep the <code>L</code>, <code>M</code>, or <code>S</code> size
      suffix intact (e.g., <code>MYHEROL.bmp</code>).
    </p>
  </>
);

const ShadowrunNotes = ({
  pack,
  steamPath,
  gogPath,
}: {
  pack: string;
  steamPath: string;
  gogPath: string;
}) => (
  <>
    <p>
      Navigate to the {pack} content pack portraits folder to replace an existing game portrait. You
      must rename your files to exactly match the portrait filename you want to overwrite.
    </p>
    <p>
      <strong>Steam:</strong>
    </p>
    <pre>{steamPath}</pre>
    <p>
      <strong>GOG:</strong>
    </p>
    <pre>{gogPath}</pre>
  </>
);

const ObsidianNotes = ({ path }: { path: string }) => (
  <>
    <p>
      Extract your downloaded PNGs into the male or female portraits folder inside your game
      installation.
    </p>
    <pre>{path}</pre>
    <p>
      <strong>Note:</strong> If adding multiple characters, you can rename the base files, but
      ensure both variants share the same base name with the <code>_lg</code> and <code>_sm</code>{" "}
      suffixes intact (e.g., <code>hero_lg.png</code> and <code>hero_sm.png</code>).
    </p>
  </>
);

export const GAMES: GamePreset[] = [
  {
    id: "pathfinder-kingmaker",
    name: "Pathfinder: Kingmaker",
    cover: coverKingmaker,
    installNotes: (
      <OwlcatNotes path="%userprofile%\AppData\LocalLow\Owlcat Games\Pathfinder Kingmaker\Portraits" />
    ),
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
    installNotes: (
      <OwlcatNotes path="%userprofile%\AppData\LocalLow\Owlcat Games\Pathfinder Wrath Of The Righteous\Portraits" />
    ),
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
    installNotes: (
      <OwlcatNotes path="%userprofile%\AppData\LocalLow\Owlcat Games\Warhammer 40000 Rogue Trader\Portraits" />
    ),
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
    installNotes: (
      <ObsidianNotes path="<Install Directory>\PillarsOfEternity_Data\data\art\gui\portraits\player\male" />
    ),
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
    installNotes: (
      <ObsidianNotes path="<Install Directory>\PillarsOfEternityII_Data\gui\portraits\player\male" />
    ),
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
    installNotes: (
      <InfinityEngineNotes path="Documents\Baldur's Gate - Enhanced Edition\portraits" />
    ),
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "CUSTOM_L.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "CUSTOM_M.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "CUSTOM_S.bmp",
      },
    ],
  },
  {
    id: "baldurs-gate-2",
    name: "Baldur's Gate II",
    cover: coverBg2,
    installNotes: (
      <InfinityEngineNotes path="Documents\Baldur's Gate II - Enhanced Edition\portraits" />
    ),
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "CUSTOM_L.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "CUSTOM_M.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "CUSTOM_S.bmp",
      },
    ],
  },
  {
    id: "tyranny",
    name: "Tyranny",
    cover: coverTyranny,
    installNotes: (
      <>
        <ObsidianNotes path="<Install Directory>\Data\data\art\gui\portraits\player\male" />
        <p>
          <strong>Steam Path:</strong>
        </p>
        <pre>Steam\steamapps\common\Tyranny\Data\data\art\gui\portraits\player\male</pre>
      </>
    ),
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
    installNotes: (
      <InfinityEngineNotes path="Documents\Icewind Dale - Enhanced Edition\portraits" />
    ),
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "CUSTOM_L.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "CUSTOM_M.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "CUSTOM_S.bmp",
      },
    ],
  },
  {
    id: "icewind-dale-2",
    name: "Icewind Dale II",
    cover: coverIwd2,
    installNotes: (
      <>
        <p>
          Extract into the <strong>portraits</strong> folder inside your game installation
          directory:
        </p>
        <pre>&lt;Install Directory&gt;\Icewind Dale 2\portraits</pre>
        <p>
          In-game, select the <strong>Custom</strong> button during character creation.
        </p>
        <p>
          <strong>Note:</strong> You can rename the base files, but the base name cannot exceed 7
          characters, and you must keep the <code>L</code> or <code>S</code> size suffix intact
          (e.g., <code>MYHEROL.bmp</code>).
        </p>
      </>
    ),
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "CUSTOM_L.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 42,
        height: 42,
        format: "bmp",
        filename: "CUSTOM_S.bmp",
      },
    ],
  },
  {
    id: "shadowrun-returns",
    name: "Shadowrun Returns",
    cover: coverSrReturns,
    installNotes: (
      <ShadowrunNotes
        pack="Seattle"
        steamPath="Steam\steamapps\common\Shadowrun Returns\Shadowrun_Data\StreamingAssets\ContentPacks\seattle\art\portraits"
        gogPath="<Install Directory>\Shadowrun Returns\Shadowrun_Data\StreamingAssets\ContentPacks\seattle\art\portraits"
      />
    ),
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
    installNotes: (
      <ShadowrunNotes
        pack="Berlin"
        steamPath="Steam\steamapps\common\Shadowrun Dragonfall Director's Cut\Dragonfall_Data\StreamingAssets\ContentPacks\berlin\art\portraits"
        gogPath="<Install Directory>\Shadowrun Dragonfall Director's Cut\Dragonfall_Data\StreamingAssets\ContentPacks\berlin\art\portraits"
      />
    ),
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
    installNotes: (
      <ShadowrunNotes
        pack="Hong Kong"
        steamPath="Steam\steamapps\common\Shadowrun Hong Kong\SRHK_Data\StreamingAssets\ContentPacks\HongKong\art\portraits"
        gogPath="<Install Directory>\Shadowrun Hong Kong\SRHK_Data\StreamingAssets\ContentPacks\HongKong\art\portraits"
      />
    ),
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
    installNotes: (
      <>
        <p>
          Extract your files into the <strong>portraits</strong> folder within your Documents
          directory (create the folder if it does not exist):
        </p>
        <pre>Documents\Neverwinter Nights\portraits</pre>
        <p>
          You can change the base name of your files, but you must preserve the{" "}
          <strong>_h, _l, _m, _s, _t</strong> suffixes.
        </p>
      </>
    ),
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
    installNotes: (
      <>
        <p>
          Extract your files into the <strong>portraits</strong> folder within your Documents
          directory (create the folder if it does not exist):
        </p>
        <pre>Documents\Neverwinter Nights 2\portraits</pre>
      </>
    ),
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
    installNotes: (
      <>
        <p>
          <strong>Enhanced Edition:</strong> Extract into your Documents folder:
        </p>
        <pre>Documents\Planescape Torment - Enhanced Edition\portraits</pre>
        <p>
          <strong>Classic Version:</strong> Copy to the game installation directory's portraits
          folder.
        </p>
        <p>
          <strong>Note:</strong> You can rename the base files, but the base name cannot exceed 7
          characters, and you must keep the <code>L</code> or <code>S</code> size suffix intact
          (e.g., <code>MYHEROL.bmp</code>).
        </p>
      </>
    ),
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "CUSTOM_L.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "CUSTOM_S.bmp",
      },
    ],
  },
  {
    id: "wasteland-2",
    name: "Wasteland 2",
    cover: coverWasteland2,
    installNotes: (
      <>
        <p>
          Extract your files into the <strong>CustomPortraits</strong> folder within your Documents
          directory:
        </p>
        <pre>Documents\My Games\Wasteland2DC\CustomPortraits</pre>
      </>
    ),
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
    installNotes: (
      <>
        <p>
          Extract your files into the <strong>CustomPortraits</strong> folder within your Documents
          directory:
        </p>
        <pre>Documents\My Games\Wasteland3\CustomPortraits</pre>
      </>
    ),
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
    installNotes: (
      <>
        <p>
          Extract into the <strong>portrait</strong> data folder within your game installation
          directory:
        </p>
        <pre>&lt;Install Directory&gt;\data\portrait</pre>
        <p>
          You must edit the <strong>userport.mes</strong> file to register your custom portrait.
        </p>
      </>
    ),
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
    installNotes: (
      <>
        <p>
          Extract into the <strong>custom_portraits</strong> folder within your game installation
          directory:
        </p>
        <pre>&lt;Install Directory&gt;\custom_portraits</pre>
        <p>
          Your filename must begin with either <strong>male_</strong> or <strong>female_</strong>.
        </p>
      </>
    ),
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
