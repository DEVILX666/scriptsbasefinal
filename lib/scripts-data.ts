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
    id: "grow-a-garden-2",
    name: "Grow a Garden 2",
    description: "",
    category: "Simulator",
    features: ["Spawn Pets & Seeds", "Steal People Fruits", "Dupe Fruits", "Instant Grow", "Teleport"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-e87bf2524ceeb4909aa2f15f555f38cf/150/150/Image/Webp/noFilter",
  },
  {
    id: "adopt-me",
    name: "Adopt Me",
    description: "",
    category: "Other",
    features: ["Item Dupe", "Auto Farm & Auto Buy", "Auto-Attack", "Kill-Aura", "No Cooldown"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-6c91fbdd8f3953131d17625e72e6ad72/150/150/Image/Webp/noFilter",
  },
  {
    id: "steal-a-brainrot",
    name: "Steal a Brainrot",
    description: "",
    category: "Adventure",
    features: ["Auto Steal", "Item ESP", "Speed Hack", "TELEPORT", "FLY"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-380d1634b060dfae54e93d379c68202c/150/150/Image/Webp/noFilter",
  },
  {
    id: "brookhaven",
    name: "Brookhaven",
    description: "",
    category: "Simulator",
    features: ["Spawn Pets & Seeds", "Steal People Fruits", "Dupe Fruits", "Instant Grow", "Teleport"],
    logoUrl: "https://tr.rbxcdn.com/180DAY-3ac5af325970a745b0156a5358174169/150/150/Image/Webp/noFilter",
  },
]
