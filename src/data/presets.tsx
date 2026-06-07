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
import type { StaticImageData } from "next/image";
import * as v from "valibot";

export const presetVariantSchema = v.object({
  key: v.string(),
  label: v.pipe(v.string(), v.trim(), v.minLength(1, "Label is required")),
  width: v.pipe(v.number(), v.minValue(1, "Must be > 0")),
  height: v.pipe(v.number(), v.minValue(1, "Must be > 0")),
  format: v.picklist(["png", "jpeg", "webp", "bmp", "tga"], "Invalid format"),
  filename: v.pipe(v.string(), v.trim()),
  quality: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(100))),
  optional: v.optional(v.boolean()),
});

export const presetSchema = v.object({
  id: v.string(),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, "Preset name is required")),
  variants: v.pipe(
    v.array(presetVariantSchema),
    v.minLength(1, "At least one variant is required"),
  ),
  cover: v.optional(v.custom<StaticImageData>(() => true)),
  installNotes: v.optional(v.custom<React.ReactNode>(() => true)),
  exportConfig: v.object({
    wrapInFolder: v.boolean(),
    defaultName: v.pipe(v.string(), v.trim()),
    maxLength: v.optional(v.pipe(v.number(), v.minValue(1, "Must be > 0"))),
  }),
});

export type PortraitVariant = v.InferOutput<typeof presetVariantSchema>;
export type Preset = Omit<v.InferOutput<typeof presetSchema>, "variants"> & {
  variants: PortraitVariant[];
};

const OwlcatNotes = ({ path }: { path: string }) => (
  <>
    <p>
      Your downloaded ZIP contains a folder matching your requested portrait name. Extract this
      entire folder directly into your game's portraits directory:
    </p>
    <pre className="mt-2!">{path}</pre>
    <ul className="mt-4 list-inside list-disc space-y-1">
      <li>
        In the character creator, select <strong>Custom Portrait</strong>.
      </li>
      <li>Your new portrait will automatically appear in the selection list.</li>
    </ul>
  </>
);

const InfinityEngineNotes = ({ path }: { path: string }) => (
  <>
    <p>
      Your downloaded ZIP contains your portrait files, automatically named with the correct size
      suffixes (e.g., <code>L</code>, <code>M</code>, <code>S</code>). Extract them directly into
      the <strong>portraits</strong> folder within your Documents directory (create the folder if it
      does not exist):
    </p>
    <pre>{path}</pre>
    <p>
      In-game, select the <strong>Custom</strong> button during character creation.
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
      If you set your portrait name to match an existing NPC's filename, your downloaded files are
      ready to use. Extract them into the {pack} content pack portraits folder to replace the
      existing portrait.
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
      Your downloaded ZIP contains your portrait files, automatically named with the correct size
      suffixes (<code>_lg</code> and <code>_sm</code>). Extract them directly into the male or
      female portraits folder inside your game installation:
    </p>
    <pre>{path}</pre>
  </>
);

export const PRESETS: Preset[] = [
  {
    id: "pathfinder-kingmaker",
    name: "Pathfinder: Kingmaker",
    cover: coverKingmaker,
    installNotes: (
      <OwlcatNotes path="%userprofile%\AppData\LocalLow\Owlcat Games\Pathfinder Kingmaker\Portraits" />
    ),
    exportConfig: {
      wrapInFolder: true,
      defaultName: "0001",
    },
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
    exportConfig: {
      wrapInFolder: true,
      defaultName: "0001",
    },
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
    exportConfig: {
      wrapInFolder: true,
      defaultName: "0001",
    },
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "player",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "png",
        filename: "{name}_lg.png",
      },
      {
        key: "small",
        label: "Small",
        width: 76,
        height: 96,
        format: "png",
        filename: "{name}_sm.png",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "player",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "png",
        filename: "{name}_lg.png",
      },
      {
        key: "small",
        label: "Small",
        width: 76,
        height: 96,
        format: "png",
        filename: "{name}_sm.png",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "CUSTOM",
      maxLength: 7,
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "{name}L.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "{name}M.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "{name}S.bmp",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "CUSTOM",
      maxLength: 7,
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "{name}L.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "{name}M.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "{name}S.bmp",
      },
    ],
  },
  {
    id: "tyranny",
    name: "Tyranny",
    cover: coverTyranny,
    exportConfig: {
      wrapInFolder: false,
      defaultName: "player",
    },
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
        filename: "{name}_lg.png",
      },
      {
        key: "small",
        label: "Small",
        width: 76,
        height: 96,
        format: "png",
        filename: "{name}_sm.png",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "CUSTOM",
      maxLength: 7,
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "{name}L.bmp",
      },
      {
        key: "medium",
        label: "Medium",
        width: 169,
        height: 266,
        format: "bmp",
        filename: "{name}M.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "{name}S.bmp",
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
          Your downloaded ZIP contains your portrait files, automatically named with the correct
          size suffixes (<code>L</code> and <code>S</code>). Extract them into the{" "}
          <strong>portraits</strong> folder inside your game installation directory:
        </p>
        <pre>&lt;Install Directory&gt;\Icewind Dale 2\portraits</pre>
        <p>
          In-game, select the <strong>Custom</strong> button during character creation.
        </p>
      </>
    ),
    exportConfig: {
      wrapInFolder: false,
      defaultName: "CUSTOM",
      maxLength: 7,
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "{name}L.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 42,
        height: 42,
        format: "bmp",
        filename: "{name}S.bmp",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom_portrait",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 212,
        height: 278,
        format: "png",
        filename: "{name}.png",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom_portrait",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 212,
        height: 278,
        format: "png",
        filename: "{name}.png",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom_portrait",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 212,
        height: 278,
        format: "png",
        filename: "{name}.png",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom",
    },
    variants: [
      {
        key: "huge",
        label: "Huge",
        width: 256,
        height: 512,
        format: "tga",
        filename: "{name}_h.tga",
      },
      {
        key: "large",
        label: "Large",
        width: 128,
        height: 256,
        format: "tga",
        filename: "{name}_l.tga",
      },
      {
        key: "medium",
        label: "Medium",
        width: 64,
        height: 128,
        format: "tga",
        filename: "{name}_m.tga",
      },
      {
        key: "small",
        label: "Small",
        width: 32,
        height: 64,
        format: "tga",
        filename: "{name}_s.tga",
      },
      {
        key: "tiny",
        label: "Tiny",
        width: 16,
        height: 32,
        format: "tga",
        filename: "{name}_t.tga",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 128,
        height: 128,
        format: "tga",
        filename: "{name}.tga",
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
          Your downloaded ZIP contains your portrait files, automatically named with the correct
          size suffixes (<code>L</code> and <code>S</code>).
        </p>
        <p>
          <strong>Enhanced Edition:</strong> Extract them into your Documents folder:
        </p>
        <pre>Documents\Planescape Torment - Enhanced Edition\portraits</pre>
        <p>
          <strong>Classic Version:</strong> Copy them to the game installation directory's portraits
          folder.
        </p>
      </>
    ),
    exportConfig: {
      wrapInFolder: false,
      defaultName: "CUSTOM",
      maxLength: 7,
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 210,
        height: 330,
        format: "bmp",
        filename: "{name}L.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 54,
        height: 84,
        format: "bmp",
        filename: "{name}S.bmp",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom_portrait",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 256,
        height: 256,
        format: "png",
        filename: "{name}.png",
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
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom_portrait",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 256,
        height: 256,
        format: "png",
        filename: "{name}.png",
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
          Your downloaded ZIP contains your portrait files, automatically named with the correct
          size suffixes. Extract them into the <strong>portrait</strong> data folder within your
          game installation directory:
        </p>
        <pre>&lt;Install Directory&gt;\data\portrait</pre>
        <p>
          You must edit the <strong>userport.mes</strong> file to register your custom portrait.
        </p>
      </>
    ),
    exportConfig: {
      wrapInFolder: false,
      defaultName: "custom",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 128,
        height: 128,
        format: "bmp",
        filename: "{name}_b.bmp",
      },
      {
        key: "small",
        label: "Small",
        width: 64,
        height: 64,
        format: "bmp",
        filename: "{name}.bmp",
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
          Extract your downloaded portrait file into the <strong>custom_portraits</strong> folder
          within your game installation directory:
        </p>
        <pre>&lt;Install Directory&gt;\custom_portraits</pre>
        <p>
          <strong>Note:</strong> You must ensure your Portrait Name begins with either{" "}
          <strong>male_</strong> or <strong>female_</strong>.
        </p>
      </>
    ),
    exportConfig: {
      wrapInFolder: false,
      defaultName: "male_custom",
    },
    variants: [
      {
        key: "large",
        label: "Large",
        width: 182,
        height: 216,
        format: "png",
        filename: "{name}.png",
      },
    ],
  },
];
