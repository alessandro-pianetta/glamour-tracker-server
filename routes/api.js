var express = require("express");
const {
  categorizeByGearset,
  removeUnwantedItems,
} = require("../utils/itemUtils");
var router = express.Router();

function generateGearsetRequest({ gearsetName, itemLevel }) {
  const request = {
    indexes: "item",
    columns:
      "ID,Name_en,Icon,EquipSlotCategoryTargetID,ClassJobCategoryTargetID",
    body: {
      query: {
        bool: {
          must: [],
          must_not: {
            match: {
              EquipSlotCategoryTargetID: "6",
            },
          },
          filter: [
            {
              range: {
                ClassJobCategoryTargetID: {
                  gte: "30",
                },
              },
            },
            {
              range: {
                EquipSlotCategoryTargetID: {
                  gte: "3",
                  lte: "8",
                },
              },
            },
            {
              range: {
                LevelItem: {
                  gte: `${itemLevel}`,
                  lte: `${itemLevel}`,
                },
              },
            },
          ],
        },
      },
      from: 0,
      size: 200,
      sort: [
        {
          ID: "asc",
        },
      ],
    },
  };

  if (typeof gearsetName === "string") {
    request.body.query.bool.must.push({
      wildcard: {
        NameCombined_en: `*${gearsetName}*`,
      },
    });
  }

  return JSON.stringify(request);
}

const DUNGEONS = {
  Sastasha: {
    gearsetName: ["plundered", "acolyte's", "foestriker's", "pirate's"],
    itemLevel: 17,
  },
  "The Tam-Tara Deepcroft": {
    gearsetName: ["plundered", "acolyte's", "foestriker's", "pirate's"],
    itemLevel: 17,
  },
  "Copperbell Mines": {
    gearsetName: ["plundered", "acolyte's", "foestriker's", "pirate's"],
    itemLevel: 17,
  },
  Halatali: {
    gearsetName: ["coeurl's", "doctore's"],
    itemLevel: 22,
  },
  "Thousand Maws of Toto-Rak": {
    gearsetName: [
      "ascetic's",
      "brigand's",
      "eternal",
      "nighthawk",
      "torturer's",
      "warden's",
    ],
    itemLevel: 26,
  },
  "Brayflox's Longstop": {
    gearsetName: ["battlemage's", "cavalry", "infantry"],
    itemLevel: 34,
  },
  "Cutter's Cry": {
    gearsetName: [
      "conquistador",
      "divining",
      "engineer's",
      "kokoroon's",
      "loyalist's",
      "paladin's",
      "poacher's",
      "seer's",
      "venerer's",
    ],
    itemLevel: 40,
  },
  "Dzemael Darkhold": {
    gearsetName: [
      "buccaneer's",
      "coliseum",
      "harlequin's",
      "pince-nez",
      "sentinel's",
      "templar's",
    ],
    itemLevel: 46,
  },
  "The Wanderer's Palace": {
    gearsetName: ["alpine", "mercenary's", "sipahi", "vermilion", "warlock's"],
    itemLevel: 55,
  },
  "Amdapor Keep": {
    gearsetName: ["alpine", "mercenary's", "sipahi", "vermilion", "warlock's"],
    itemLevel: 55,
  },
  "Pharos Sirius": {
    gearsetName: [
      "austere",
      "blessed",
      "demagogue",
      "hetairos",
      "lord's",
      "noble's",
      "peltast",
      "strategos",
      "thick",
      "toxote's",
      "war",
    ],
    itemLevel: 60,
  },
  "Copperbell Mines (Hard)": {
    gearsetName: [
      "austere",
      "blessed",
      "demagogue",
      "hetairos",
      "lord's",
      "noble's",
      "peltast",
      "strategos",
      "thick",
      "toxote's",
      "war",
    ],
    itemLevel: 60,
  },
  "Haukke Manor (Hard)": {
    gearsetName: [
      "austere",
      "blessed",
      "demagogue",
      "hetairos",
      "lord's",
      "noble's",
      "peltast",
      "strategos",
      "thick",
      "toxote's",
      "war",
    ],
    itemLevel: 60,
  },
  "The Lost City of Amdapor": {
    gearsetName: [
      "darklight",
      "fistfighter's",
      "hussar's",
      "magician's",
      "pilgrim's",
      "protector's",
      "shikaree's",
    ],
    itemLevel: 70,
  },
  "Halatali (Hard)": {
    gearsetName: [
      "darklight",
      "fistfighter's",
      "hussar's",
      "magician's",
      "pilgrim's",
      "protector's",
      "shikaree's",
    ],
    itemLevel: 70,
  },
  "Brayflox's Longstop (Hard)": {
    gearsetName: [
      "darklight",
      "fistfighter's",
      "hussar's",
      "magician's",
      "pilgrim's",
      "protector's",
      "shikaree's",
    ],
    itemLevel: 70,
  },
  "Hullbreaker Isle": {
    gearsetName: "divine",
    itemLevel: 80,
  },
  "The Stone Vigil (Hard)": {
    gearsetName: "divine",
    itemLevel: 80,
  },
  "The Tam-Tara Deepcroft (Hard)": {
    gearsetName: "divine",
    itemLevel: 80,
  },
  "The Keeper of the Lake": {
    gearsetName: ["bogatyr's", "picaroon's", "varlet's"],
    itemLevel: 100,
  },
  "The Wanderer's Palace (Hard)": {
    gearsetName: ["bogatyr's", "picaroon's", "varlet's"],
    itemLevel: 100,
  },
  "Amdapor Keep (Hard)": {
    gearsetName: ["bogatyr's", "picaroon's", "varlet's"],
    itemLevel: 100,
  },
  "The Dusk Vigil": { gearsetName: "ishgardian", itemLevel: 120 },
  "Sohm Al": { gearsetName: "woad", itemLevel: 130 },
  "The Aery": { gearsetName: "orthodox", itemLevel: 136 },
  "The Vault": { gearsetName: "halonic", itemLevel: 142 },
  "The Great Gubal Library": { gearsetName: "sharlayan", itemLevel: 148 },
  Neverreap: {
    gearsetName: "valerian",
    itemLevel: 160,
  },
  "The Fractal Continuum": {
    gearsetName: "valerian",
    itemLevel: 160,
  },
  "Saint Mocianne's Arboretum": {
    gearsetName: ["duelist", "thief", "plague"],
    itemLevel: 185,
  },
  "Pharos Sirius (Hard)": {
    gearsetName: ["duelist", "thief", "plague"],
    itemLevel: 185,
  },
  "The Antitower": {
    gearsetName: "dravanian",
    itemLevel: 195,
  },
  "The Lost City of Amdapor (Hard)": {
    gearsetName: "dravanian",
    itemLevel: 195,
  },
  "Sohr Khai": {
    gearsetName: [
      "berserker's",
      "conqueror's",
      "panegyrist's",
      "prophet's",
      "subjugator's",
      "viking",
      "wrangler's",
    ],
    itemLevel: 215,
  },
  "Hullbreaker Isle (Hard)": {
    gearsetName: [
      "berserker's",
      "conqueror's",
      "panegyrist's",
      "prophet's",
      "subjugator's",
      "viking",
      "wrangler's",
    ],
    itemLevel: 215,
  },
  Xelphatol: {
    gearsetName: "valkyrie's",
    itemLevel: 225,
  },
  "The Great Gubal Library (Hard)": {
    gearsetName: "valkyrie's",
    itemLevel: 225,
  },
  "Baelsar's Wall": {
    gearsetName: "filibuster's",
    itemLevel: 245,
  },
  "Sohm Al (Hard)": {
    gearsetName: "filibuster's",
    itemLevel: 245,
  },
  "The Sirensong Sea": { gearsetName: "ghost barque", itemLevel: 260 },
  "Shisui of the Violet Tides": {
    gearsetName: ["ruby tide", "shisui"],
    itemLevel: 270,
  },
  "Bardam's Mettle": { gearsetName: "nomad's", itemLevel: 276 },
  "Doma Castle": { gearsetName: "yanxian", itemLevel: 282 },
  "Castrum Abania": { gearsetName: ["valerian", "xenobian"], itemLevel: 288 },
  "Ala Mhigo": { gearsetName: "arhat", itemLevel: 300 },
  "Kugane Castle": { gearsetName: "arhat", itemLevel: 300 },
  "The Temple of the Fist": { gearsetName: "arhat", itemLevel: 300 },
  "The Drowned City of Skalla": { gearsetName: "skallic", itemLevel: 315 },
  "Hell's Lid": { gearsetName: "farlander", itemLevel: 325 },
  "The Fractal Continuum (Hard)": { gearsetName: "farlander", itemLevel: 325 },
  "The Swallow's Compass": { gearsetName: "bonewicca", itemLevel: 345 },
  "Saint Mocianne's Arboretum (Hard)": {
    gearsetName: "royal volunteer's",
    itemLevel: 355,
  },
  "The Burn": { gearsetName: "royal volunteer's", itemLevel: 355 },
  "The Ghimlyt Dark": { gearsetName: "alliance", itemLevel: 375 },
  "Holminster Switch": { gearsetName: "lakeland", itemLevel: 390 },
  "Dohn Mheg": { gearsetName: "voeburtite", itemLevel: 400 },
  "The Qitana Ravel": { gearsetName: "ravel keeper's", itemLevel: 406 },
  "Malikah's Well": { gearsetName: "nabaath", itemLevel: 412 },
  "Mt. Gulg": { gearsetName: "the forgiven's", itemLevel: 418 },
  "The Grand Cosmos": { gearsetName: "warg", itemLevel: 445 },
  "Anamnesis Anyder": { gearsetName: "anamnesis", itemLevel: 455 },
  "The Heroes' Gauntlet": { gearsetName: "shadowless", itemLevel: 475 },
  "Matoya's Relict": { gearsetName: "heirloom", itemLevel: 485 },
  "Paglth'an": { gearsetName: "paglth'an", itemLevel: 505 },
  "The Tower of Zot": { gearsetName: "manusya", itemLevel: 520 },
  "The Tower of Babil": { gearsetName: "imperial", itemLevel: 530 },
  Vanaspati: { gearsetName: "palaka", itemLevel: 536 },
  "Ktisis Hyperboreia": { gearsetName: "ktiseos", itemLevel: 542 },
  "Alzadaal's Legacy": { gearsetName: "darbar", itemLevel: 575 },
  "The Fell Court of Troia": { gearsetName: "troian", itemLevel: 595 },
  "Lapis Manalis": { gearsetName: "manalis", itemLevel: 605 },
  "Labyrinth of the Ancients": {
    gearsetName: ["of light", "onion", "fuma", "ballad", "crimson", "royal"],
    itemLevel: 80,
  },
  "Syrcus Tower": {
    gearsetName: ["phlegethon's", "the guardian's", "amon's", "scylla's"],
    itemLevel: 100,
  },
  "The World of Darkness": {
    gearsetName: "demon",
    itemLevel: 120,
  },
  "The Void Ark": {
    gearsetName: "void ark",
    itemLevel: 200,
  },
  "The Weeping City of Mhach": {
    gearsetName: "yafaemi",
    itemLevel: 230,
  },
  "Dun Scaith": {
    gearsetName: "diabolic",
    itemLevel: 260,
  },
  "The Royal City of Rabanastre": {
    gearsetName: "ivalician",
    itemLevel: 330,
  },
  "The Ridorana Lighthouse": {
    gearsetName: "ivalician",
    itemLevel: 360,
  },
  "The Orbonne Monastery": {
    gearsetName: "ivalician",
    itemLevel: 390,
  },
  "The Copied Factory": {
    gearsetName: "yorha",
    itemLevel: 460,
  },
  "The Puppets' Bunker": {
    gearsetName: "yorha",
    itemLevel: 490,
  },
  "The Tower at Paradigm's Breach": {
    gearsetName: ["yorha", "obsolete android's"],
    itemLevel: 520,
  },
  Aglaia: {
    gearsetName: "panthean",
    itemLevel: 590,
  },
  Euphrosyne: {
    gearsetName: "hypostatic",
    itemLevel: 620,
  },
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/populate", function (req, res, next) {
  const data = {};
  // const dungeonNames = Object.keys(DUNGEONS);
  const dungeonNames = ["The Drowned City of Skalla"];
  dungeonNames.forEach(async (name) => {
    const dungeonInfo = DUNGEONS[name];
    const response = await fetch("https://xivapi.com/search", {
      method: "POST",
      body: generateGearsetRequest(dungeonInfo),
    });
    const content = await response.json();

    if (content && content.Results.length) {
      const cleanedData = removeUnwantedItems(dungeonInfo, content.Results);
      const gearsets = categorizeByGearset(cleanedData);
      console.log(gearsets);
      // Update fx ^ for new Item schema
    }
  });
  return;
});
module.exports = router;
