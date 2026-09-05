export interface GameScript {
  id: string
  name: string
  description: string
  category: "FPS" | "RPG" | "Simulator" | "Adventure" | "Obby" | "Horror" | "Other"
  features: string[]
  logoUrl: string
}

export const gameScripts: GameScript[] = [
  {
    id: "Murder Mystery 2",
    name: "Murder Mystery 2",
    description: "",
    category: "Simulator",
    features: ["Spawn Pets & Seeds", "Steal People Fruits", "Dupe Fruits", "Instant Grow", "Teleport"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-313f1416cd5e4335a97d054183743fdd/150/150/Image/Webp/noFilter",
  },
  {
    id: "adopt-me",
    name: "Adopt Me",
    description: "",
    category: "Other",
    features: ["Item Dupe", "Auto Farm & Auto Buy", "Auto-Attack", "Kill-Aura", "No Cooldown"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-5924fcb75a087ef1c413bd8db3d501a7/150/150/Image/Webp/noFilter",
  },
  {
    id: "grow-a-garden-2",
    name: "Grow a Garden 2",
    description: "",
    category: "Adventure",
    features: ["Auto Steal", "Item ESP", "Speed Hack", "TELEPORT", "FLY"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-9034ef0846b1f55d0b41e95532191efa/150/150/Image/Webp/noFilter",
  },
  {
    id: "steal-a-brainrot",
    name: "Steal a Brainrot",
    description: "",
    category: "Simulator",
    features: ["Spawn Pets & Seeds", "Steal People Fruits", "Dupe Fruits", "Instant Grow", "Teleport"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-e867b1a09af00635643dd3d6d10e34a3/150/150/Image/Webp/noFilter",
  },
]
