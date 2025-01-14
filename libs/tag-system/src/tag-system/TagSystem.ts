import { TagObject, TagSystem } from "../types/tags"

export const AgentTags: TagObject[] = [
    {tag:"astra",displayName:"Astra",description:"Player is playing Astra", unique: true, timeless: true, protected: true, keybind: "a", id: "ag001"},
    {tag:"breach",displayName:"Breach",description:"Player is playing Breach", unique: true, timeless: true, protected: true, keybind: "m", id: "ag003"},
    {tag:"brimstone",displayName:"Brimstone",description:"Player is playing Brimstone", unique: true, timeless: true, protected: true, keybind: "b", id: "ag002"},
    {tag:"chamber",displayName:"Chamber",description:"Player is playing Chamber", unique: true, timeless: true, protected: true, keybind: "c", id: "ag004"},
    {tag:"clove",displayName:"Clove",description:"Player is playing Clove", unique: true, timeless: true, protected: true, keybind: "q", id: "ag024"},
    {tag:"cypher",displayName:"Cypher",description:"Player is playing Cypher", unique: true, timeless: true, protected: true, keybind: "x", id: "ag005"},
    {tag:"deadlock",displayName:"Deadlock",description:"Player is playing Deadlock", unique: true, timeless: true, protected: true, keybind: "d", id: "ag006"},
    {tag:"fade",displayName:"Fade",description:"Player is playing Fade", unique: true, timeless: true, protected: true, keybind: "f", id: "ag007"},
    {tag:"gekko",displayName:"Gekko",description:"Player is playing Gekko", unique: true, timeless: true, protected: true, keybind: "g", id: "ag008"},
    {tag:"harbor",displayName:"Harbor",description:"Player is playing Harbor", unique: true, timeless: true, protected: true, keybind: "h", id: "ag009"},
    {tag:"iso",displayName:"Iso",description:"Player is playing Iso", unique: true, timeless: true, protected: true, keybind: "i", id: "ag010"},
    {tag:"jett",displayName:"Jett",description:"Player is playing Jett", unique: true, timeless: true, protected: true, keybind: "j", id: "ag011"},
    {tag:"kayo",displayName:"Kayo",description:"Player is playing KAY/O", unique: true, timeless: true, protected: true, keybind: "k", id: "ag012"},
    {tag:"killjoy",displayName:"Killjoy",description:"Player is playing Killjoy", unique: true, timeless: true, protected: true, keybind: "l", id: "ag013"},
    {tag:"neon",displayName:"Neon",description:"Player is playing Neon", unique: true, timeless: true, protected: true, keybind: "n", id: "ag014"},
    {tag:"omen",displayName:"Omen",description:"Player is playing Omen", unique: true, timeless: true, protected: true, keybind: "o", id: "ag015"},
    {tag:"phoenix",displayName:"Phoenix",description:"Player is playing Phoenix", unique: true, timeless: true, protected: true, keybind: "p", id: "ag016"},
    {tag:"raze",displayName:"Raze",description:"Player is playing Raze", unique: true, timeless: true, protected: true, keybind: "r", id: "ag017"},
    {tag:"reyna",displayName:"Reyna",description:"Player is playing Reyna", unique: true, timeless: true, protected: true, keybind: "e", id: "ag018"},
    {tag:"sage",displayName:"Sage",description:"Player is playing Sage", unique: true, timeless: true, protected: true, keybind: "w", id: "ag019"},
    {tag:"skye",displayName:"Skye",description:"Player is playing Skye", unique: true, timeless: true, protected: true, keybind: "s", id: "ag020"},
    {tag:"sova",displayName:"Sova",description:"Player is playing Sova", unique: true, timeless: true, protected: true, keybind: "z", id: "ag021"},
    {tag:"tejo",displayName:"Tejo",description:"Player is playing Tejo", unique: true, timeless: true, protected: true, keybind: "t", id: "ag025"},
    {tag:"viper",displayName:"Viper",description:"Player is playing Viper", unique: true, timeless: true, protected: true, keybind: "v", id: "ag022"},
    {tag:"vyse",displayName:"Vyse",description:"Player is playing Vyse", unique: true, timeless: true, protected: true, keybind: "f", id: "ag025"},
    {tag:"yoru",displayName:"Yoru",description:"Player is playing Yoru", unique: true, timeless: true, protected: true, keybind: "y", id: "ag023"}
]
export const MapTags: TagObject[] = [
    {tag:"abyss",displayName:"Abyss",description:"Clip takes place on Abyss", unique: true, timeless: true, protected: true, keybind: "a", id: "m001"},
    {tag:"ascent",displayName:"Ascent",description:"Clip takes place on Ascent", unique: true, timeless: true, protected: true, keybind: "t", id: "m002"},
    {tag:"bind",displayName:"Bind",description:"Clip takes place on Bind", unique: true, timeless: true, protected: true, keybind: "b", id: "m003"},
    {tag:"breeze",displayName:"Breeze",description:"Clip takes place on Breeze", unique: true, timeless: true, protected: true, keybind: "r", id: "m004"},
    {tag:"fracture",displayName:"Fracture",description:"Clip takes place on Fracture", unique: true, timeless: true, protected: true, keybind: "f", id: "m005"},
    {tag:"haven",displayName:"Haven",description:"Clip takes place on Haven", unique: true, timeless: true, protected: true, keybind: "h", id: "m006"},
    {tag:"icebox",displayName:"Icebox",description:"Clip takes place on Icebox", unique: true, timeless: true, protected: true, keybind: "i", id: "m007"},
    {tag:"lotus",displayName:"Lotus",description:"Clip takes place on Lotus", unique: true, timeless: true, protected: true, keybind: "l", id: "m008"},
    {tag:"pearl",displayName:"Pearl",description:"Clip takes place on Pearl", unique: true, timeless: true, protected: true, keybind: "p", id: "m009"},
    {tag:"split",displayName:"Split",description:"Clip takes place on Split", unique: true, timeless: true, protected: true, keybind: "s", id: "m010"},
    {tag:"sunset",displayName:"Sunset",description:"Clip takes place on Sunset", unique: true, timeless: true, protected: true, keybind: "u", id: "m011"}
]
export const GenericTags: TagSystem = {
    agents: {
        tags: AgentTags,
        groupName: 'Agents',
        keybindGroup: 'q',
        exclusive: true,
        iterable: true,
        id: 'q01'
    },
    maps: {
        tags: MapTags,
        groupName: 'Maps',
        keybindGroup: 'w',
        exclusive: true,
        iterable: true,
        id: 'w01'
    },
    guns: {
        tags: [
            {tag:"ares",displayName:"Ares",description:"Player gets a kill with the Ares", unique: true, timeless: true, protected: false, keybind: "a", id: "g001"},
            {tag:"bucky",displayName:"Bucky",description:"Player gets a kill with the Bucky", unique: true, timeless: true, protected: false, keybind: "b", id: "g002"},
            {tag:"bulldog",displayName:"Bulldog",description:"Player gets a kill with the Bulldog", unique: true, timeless: true, protected: false, keybind: "l", id: "g003"},
            {tag:"classic",displayName:"Classic",description:"Player gets a kill with the Classic", unique: true, timeless: true, protected: false, keybind: "c", id: "g004"},
            {tag:"frenzy",displayName:"Frenzy",description:"Player gets a kill with the Frenzy", unique: true, timeless: true, protected: false, keybind: "f", id: "g005"},
            {tag:"ghost",displayName:"Ghost",description:"Player gets a kill with the Ghost", unique: true, timeless: true, protected: false, keybind: "g", id: "g006"},
            {tag:"guardian",displayName:"Guardian",description:"Player gets a kill with the Guardian", unique: true, timeless: true, protected: false, keybind: "d", id: "g007"},
            {tag:"judge",displayName:"Judge",description:"Player gets a kill with the Judge", unique: true, timeless: true, protected: false, keybind: "j", id: "g008"},
            {tag:"marshal",displayName:"Marshal",description:"Player gets a kill with the Marshal", unique: true, timeless: true, protected: false, keybind: "m", id: "g009"},
            {tag:"operator",displayName:"Operator",description:"Player gets a kill with the Operator", unique: true, timeless: true, protected: false, keybind: "o", id: "g010"},
            {tag:"odin",displayName:"Odin",description:"Player gets a kill with the Odin", unique: true, timeless: true, protected: false, keybind: "i", id: "g011"},
            {tag:"outlaw",displayName:"Outlaw",description:"Player gets a kill with the Outlaw", unique: true, timeless: true, protected: false, keybind: "w", id: "g019"},
            {tag:"phantom",displayName:"Phantom",description:"Player gets a kill with the Phantom", unique: true, timeless: true, protected: false, keybind: "p", id: "g012"},
            {tag:"sheriff",displayName:"Sheriff",description:"Player gets a kill with the Sheriff", unique: true, timeless: true, protected: false, keybind: "s", id: "g013"},
            {tag:"shorty",displayName:"Shorty",description:"Player gets a kill with the Shorty", unique: true, timeless: true, protected: false, keybind: "r", id: "g014"},
            {tag:"spectre",displayName:"Spectre",description:"Player gets a kill with the Spectre", unique: true, timeless: true, protected: false, keybind: "c", id: "g015"},
            {tag:"stinger",displayName:"Stinger",description:"Player gets a kill with the Stinger", unique: true, timeless: true, protected: false, keybind: "t", id: "g016"},
            {tag:"vandal",displayName:"Vandal",description:"Player gets a kill with the Vandal", unique: true, timeless: true, protected: false, keybind: "v", id: "g017"},
            {tag:"knife",displayName:"Knife",description:"Player gets a kill with their Knife", unique: true, timeless: true, protected: false, keybind: "k", id: "g018"}
        ],
        groupName: "Guns",
        keybindGroup: "g",
        exclusive: false,
        iterable: false,
        id: "g03"
    },
    statusEffects:{
        tags: [
            {tag:"nearsighted",displayName:"Near-Sighted",description:"Player gets near-sighted", unique: false, timeless: false, protected: false, keybind: "n", id: "s001"},
            {tag:"blinded",displayName:"Blinded",description:"Player gets blinded", unique: false, timeless: false, protected: false, keybind: "b", id: "s002"},
            {tag:"stunned",displayName:"Stunned",description:"Player gets stunned", unique: false, timeless: false, protected: false, keybind: "s", id: "s003"},
            {tag:"deafened",displayName:"Deafened",description:"player gets deafened", unique: false, timeless: false, protected: false, keybind: "f", id: "s004"},
            {tag:"decayed",displayName:"Decayed",description:"Player gets decayed", unique: false, timeless: false, protected: false, keybind: "d", id: "s005"},
            {tag:"trailed",displayName:"Trailed",description:"player gets trailed", unique: false, timeless: false, protected: false, keybind: "t", id: "s006"},
            {tag:"supressed",displayName:"Supressed",description:"Player is supressed", unique: false, timeless: false, protected: false, keybind: "p", id: "s007"},
            {tag:"detained",displayName:"Detained",description:"Player is detained", unique: false, timeless: false, protected: false, keybind: "e", id: "s008"},
            {tag:"healed",displayName:"Healed",description:"Player gets healing from an ally", unique: false, timeless: false, protected: false, keybind: "h", id: "s009"},
            {tag:"pinged",displayName:"Pinged",description:"Player gets pinged", unique: false, timeless: false, protected: false, keybind: "g", id: "s010"},
            {tag:"slowed",displayName:"Slowed",description:"Player is slowed", unique: false, timeless: false, protected: false, keybind: "w", id: "s011"},
            {tag:"revived",displayName:"Revived",description:"Player revives", unique: false, timeless: false, protected: false, keybind: "x", id: "s0012"},
            {tag:"vulnerable",displayName:"Vulnerable",description:"Player get vulnerable", unique: false, timeless: false, protected: false, keybind: "v", id: "s0013"},
            {tag:"displaced",displayName:"Displaced",description:"Player is displaced", unique: false, timeless: false, protected: false, keybind: "c", id: "s0014"},
            {tag:"stimmed",displayName:"Stimmed",description:"Player is stimmed", unique: false, timeless: false, protected: false, keybind: "m", id: "s0015"}
        ],
        groupName: 'Status Effects',
        keybindGroup: "s",
        exclusive: false,
        iterable: false,
        id: "g04"
    },
    clipType:{
        tags: [
            {tag:"cclip",displayName:"Custom Clip",description:"Clip is a custom clip", unique: true, timeless: true, protected: false, keybind: "c", id: "c001"},
            {tag:"igclip",displayName:"In-Game Clip",description:"Clip showcases a real game", unique: true, timeless: true, protected: false, keybind: "i", id: "c002"},
            {tag:"strmclip",displayName:"Streamer Clip",description:"Clip showcases a game by a famous streamer", unique: true, timeless: true, protected: false, keybind: "s", id: "c003"},
            {tag:"deathmatch",displayName:"Death match",description:"Clip comes from a deathmatch", unique: true, timeless: true, protected: false, keybind: "d", id: "c004"}
        ],
        groupName: 'Clip Type',
        keybindGroup: "c",
        exclusive: true,
        iterable: false,
        id: "g05"
    },
    abilities:{
        tags: [
            {tag:"ult",displayName:"Ultimate",description:"Player casted their ultimate", unique: true, timeless: false, protected: false, keybind: "x", id: "a001"},
            {tag:"ckey",displayName:"C key",description:"Player casted their C ability", unique: false, timeless: false, protected: false, keybind: "c", id: "a002"},
            {tag:"qkey",displayName:"Q key",description:"Player casted their Q ability", unique: false, timeless: false, protected: false, keybind: "q", id: "a003"},
            {tag:"ekey",displayName:"E key",description:"Player casted their E ability", unique: false, timeless: false, protected: false, keybind: "e", id: "a004"},
        ],
        groupName: 'Abilities',
        keybindGroup: "a",
        exclusive: false,
        iterable: false,
        id: "g06"
    },
    kda:{                
        tags: [
            {tag:"kill",displayName:"Kill",description:"Player got a kill", unique: false, timeless: false, protected: false, keybind: "k", id: "k001"},
            {tag:"death",displayName:"Death",description:"Player gets killed", unique: false, timeless: false, protected: false, keybind: "d", id: "k002"},
            {tag:"headshot",displayName:"Headshot",description:"Player gets a headshot kill", unique: false, timeless: false, protected: false, keybind: "h", id: "n002"},
            {tag:"wb",displayName:"Wall Bang",description:"Player got a kill by shooting through an obstacle", unique: false, timeless: false, protected: false, keybind: "w", id: "n005"},
            {tag:"bk",displayName:"Blind Kill",description:"Player got a kill without vision of the enemy", unique: false, timeless: false, protected: false, keybind: "b", id: "n006"},
            {tag:"ace",displayName:"Ace",description:"Player gets an ace", unique: true, timeless: false, protected: false, keybind: "x", id: "k007"},
            {tag:"opd",displayName:"Opped",description:"Player got killed by an Operator", unique: false, timeless: false, protected: false, keybind: "o", id: "k008"},
            {tag:"kba",displayName:"Kill by Ability",description:"Player gets a kill with the one of their abilities", unique: false, timeless: false, protected: false, keybind: "a", id: "k009"},
        ],
        groupName: 'KDA',
        keybindGroup: "k",
        exclusive: false,
        iterable: false,
        id: "g07"
    },
    playerSide:{
        tags: [
            {tag:"attk",displayName:"Attacker",description:"Player is an attacker", unique: true, timeless: true, protected: false, keybind: "a", id: "p001"},
            {tag:"def",displayName:"Defender",description:"Player is a defender", unique: true, timeless: true, protected: false, keybind: "d", id: "p002"}
        ],
        groupName: 'Player Side',
        keybindGroup: "p",
        exclusive: true,
        iterable: false,
        id: "g08"
    },
    mapAreas:{
        tags: [
            {tag:"asite",displayName:"A site",description:"Player walks into A Site", unique: true, timeless: false, protected: false, keybind: "a", id: "z001"},
            {tag:"aside",displayName:"A side",description:"Player walks into A Side", unique: true, timeless: false, protected: false, keybind: "q", id: "z007"},
            {tag:"bsite",displayName:"B site",description:"Player walks into B Site", unique: true, timeless: false, protected: false, keybind: "b", id: "z002"},
            {tag:"bside",displayName:"B side",description:"Player walks into B Side", unique: true, timeless: false, protected: false, keybind: "v", id: "z008"},
            {tag:"csite",displayName:"C site",description:"Player walks into C Site", unique: true, timeless: false, protected: false, keybind: "c", id: "z003"},
            {tag:"garage",displayName:"Garage",description:"Player walks into Garage", unique: true, timeless: false, protected: false, keybind: "g", id: "z009"},
            {tag:"heaven",displayName:"Heaven",description:"Player walks into Heaven", unique: true, timeless: false, protected: false, keybind: "g", id: "z010"},
            {tag:"market",displayName:"Market",description:"Player walks into Market", unique: true, timeless: false, protected: false, keybind: "k", id: "z011"},
            {tag:"mid",displayName:"Mid",description:"Player walks into Mid", unique: true, timeless: false, protected: false, keybind: "m", id: "z004"},
            {tag:"lobby",displayName:"Lobby",description:"Player walks into Lobby", unique: true, timeless: false, protected: false, keybind: "l", id: "z012"},
            {tag:"aspawn",displayName:"attacker-spawn",description:"Player walks into Attacker Spawn", unique: true, timeless: false, protected: false, keybind: "x", id: "z005"},
            {tag:"dspawn",displayName:"defender-spawn",description:"Player walks into Defender Spawn", unique: true, timeless: false, protected: false, keybind: "o", id: "z006"},
        ],
        groupName: 'Map Areas',
        keybindGroup: "n",
        exclusive: false,
        iterable: false,
        id: "g09"
    },
    mechanics:{
        tags: [
            {tag:"jigglepeak",displayName:"Jiggle Peak",description:"Player jiggle peeks at some point", unique: false, timeless: false, protected: false, keybind: "j", id: "n001"},
            {tag:"swing",displayName:"Swing",description:"Player wide-swings an angle", unique: false, timeless: false, protected: false, keybind: "s", id: "n003"},
            {tag:"trade",displayName:"Trade",description:"Player got a kill by trading an ally", unique: false, timeless: false, protected: false, keybind: "t", id: "n004"},
        ],
        groupName: 'Mechanics',
        keybindGroup: "m",
        exclusive: false,
        iterable: false,
        id: "g11"
    },
    gameObjects:{
        tags: [
            {tag:"ultorb",displayName:"Ultimate Orb",description:"Player acquired an ultimate orb", unique: false, timeless: false, protected: false, keybind: "o", id: "o001"}
        ],
        groupName: 'Game Objects',
        keybindGroup: "o",
        exclusive: false,
        iterable: false,
        id: "g12"
    },
    gameEvents:{
        tags: [
            {tag:"spikeplant",displayName:"Planted Spike",description:"Player planted the spike", unique: true, timeless: false, protected: false, keybind: "p", id: "e001"},
            {tag:"spikedefuse",displayName:"Defused Spike",description:"Player defused the spike", unique: true, timeless: false, protected: false, keybind: "o", id: "e002"},
            {tag:"pplant",displayName:"Post-Plant",description:"Important action occurs while planted spike counts down", unique: true, timeless: false, protected: false, keybind: "a", id: "t007"},
            {tag:"clutch",displayName:"Clutch",description:"Player clutched the round", unique: true, timeless: true, protected: false, keybind: "c", id: "e003"},
            {tag:"spikeblow",displayName:"Spike Blow",description:"Spike goes off during the clip", unique: true, timeless: false, protected: false, keybind: "x", id: "e004"},
            {tag:"tp",displayName:"Teleportation",description:"Player teleported using an ability or going through a teleporter", unique: false, timeless: false, protected: false, keybind: "t", id: "e005"},
            {tag:"thrifty",displayName:"Thrifty",description:"Player's team won round where their team were on a resource disadvantage", unique: true, timeless: true, protected: false, keybind: "r", id: "e006"},
            {tag:"flawless",displayName:"Flawless",description:"Player's team won round with no casualty", unique: true, timeless: true, protected: false, keybind: "f", id: "e012"},
            {tag:"won",displayName:"Won Game",description:"Player's team won the match on this round", unique: true, timeless: true, protected: false, keybind: "v", id: "e013"},
            {tag:"defeat",displayName:"Defeat",description:"Player's team lost the match on this round", unique: true, timeless: true, protected: false, keybind: "d", id: "e014"},
            {tag:"winround",displayName:"Won Round",description:"Player's team won this round", unique: true, timeless: true, protected: false, keybind: "w", id: "e015"},
            {tag:"lostround",displayName:"Lost Round",description:"Player's team lost this round", unique: true, timeless: true, protected: false, keybind: "l", id: "e016"},
        ],
        groupName: 'Game Events',
        keybindGroup: "e",
        exclusive: false,
        iterable: false,
        id: "g13"
    },
    fights:{
        tags: [
            {tag:"1v1",displayName:"1v1",description:"Player won a round where they were the last man standing against 1 opponent", unique: false, timeless: false, protected: false, keybind: "1", id: "f007"},
            {tag:"1v2",displayName:"1v2",description:"Player won a round where they were the last man standing against 2 opponents", unique: false, timeless: false, protected: false, keybind: "2", id: "f008"},
            {tag:"1v3",displayName:"1v3",description:"Player won a round where they were the last man standing against 3 opponents", unique: true, timeless: false, protected: false, keybind: "3", id: "f009"},
            {tag:"1v4",displayName:"1v4",description:"Player won a round where they were the last man standing against 4 opponents", unique: true, timeless: false, protected: false, keybind: "4", id: "f010"},
            {tag:"1v5",displayName:"1v5",description:"Player won a round where they were the last man standing against 5 opponents", unique: true, timeless: false, protected: false, keybind: "5", id: "f011"},
        ],
        groupName: 'Fights',
        keybindGroup: "f",
        exclusive: false,
        iterable: false,
        id: "g14"
    },
    gameTactics:{
        tags: [
            {tag:"anchor",displayName:"Anchor",description:"Player was defending a site from inside", unique: false, timeless: false, protected: false, keybind: "a", id: "t001"},
            {tag:"execute",displayName:"Execute",description:"Player's team coordinate to rush into a site", unique: false, timeless: false, protected: false, keybind: "x", id: "t002"},
            {tag:"rotation",displayName:"Rotation",description:"Player rotates to another site", unique: false, timeless: false, protected: false, keybind: "r", id: "t003"},
            {tag:"lurker",displayName:"Lurker",description:"Player is lurking", unique: false, timeless: false, protected: false, keybind: "l", id: "t004"},
            {tag:"teamplay",displayName:"Team Play",description:"Clip showcases a successful team play", unique: false, timeless: false, protected: false, keybind: "t", id: "t005"},
            {tag:"retake",displayName:"Retake",description:"Player attempts to retake a site where the spike has been planted", unique: false, timeless: false, protected: false, keybind: "g", id: "t006"},
            {tag:"lineup",displayName:"Line-Up",description:"Player performs a line-up ability cast", unique: false, timeless: false, protected: false, keybind: "l", id: "t008"}
        ],
        groupName: 'Game Tactics',
        keybindGroup: "t",
        exclusive: false,
        iterable: false,
        id: "g15"
    }
}
export const privateTags: TagObject[] = [
    {tag:"duelist",displayName:"Duelist",description:"Player is playing a duelist", unique: true, timeless: true, protected: false, keybind: "d", id: "r001"},
    {tag:"controller",displayName:"Controller",description:"Player is playing a controller", unique: true, timeless: true, protected: false, keybind: "c", id: "r002"},
    {tag:"sentinel",displayName:"Sentinel",description:"Player is playing a sentinel", unique: true, timeless: true, protected: false, keybind: "s", id: "r003"},
    {tag:"initiator",displayName:"Initiator",description:"Player is playing an initiator", unique: true, timeless: true, protected: false, keybind: "i", id: "r004"},
    {tag:"mk",displayName:"Multi Kill",description:"Player gets a multi-kill", unique: true, timeless: true, protected: false, keybind: "", id: "k003"},
    {tag:"2k",displayName:"Double kill",description:"Player gets a double-kill", unique: true, timeless: true, protected: false, keybind: "", id: "k004"},
    {tag:"3k",displayName:"Triple kill",description:"Player gets a triple-kill", unique: true, timeless: true, protected: false, keybind: "", id: "k005"},
    {tag:"4k",displayName:"Quadra kill",description:"Player gets a quadra-kill", unique: true, timeless: true, protected: false, keybind: "", id: "k006"},
    {tag:"molly",displayName:"Molly",description:"Player casted a molly ability", unique: false, timeless: false, protected: false, keybind: "", id: "a005"},
    {tag:"smoke",displayName:"Smoke",description:"Player casted a smoke ability", unique: false, timeless: false, protected: false, keybind: "", id: "a006"},
    {tag:"wall",displayName:"Wall",description:"Player casted a walling ability", unique: false, timeless: false, protected: false, keybind: "", id: "a007"},
    {tag:"flash",displayName:"Flash",description:"Player casted a flashing or near-sighting ability", unique: false, timeless: false, protected: false, keybind: "", id: "a008"},
    {tag:"aside",displayName:"A Side",description:"Important action occurs on the A half of the map", unique: true, timeless: false, protected: false, keybind: "", id: "z007"},
    {tag:"bside",displayName:"B Side",description:"Important action occurs on the B half of the map", unique: true, timeless: false, protected: false, keybind: "", id: "z008"},
    {tag:"hell",displayName:"Hell",description:"Important action occurs on 'hell'", unique: true, timeless: false, protected: false, keybind: "", id: "z009"},
    {tag:"heaven",displayName:"Heaven",description:"Important action occurs on 'heaven", unique: true, timeless: false, protected: false, keybind: "", id: "z010"},
    {tag:"garage",displayName:"Garage",description:"Important action occurs on 'garage", unique: true, timeless: false, protected: false, keybind: "", id: "z011"}
]