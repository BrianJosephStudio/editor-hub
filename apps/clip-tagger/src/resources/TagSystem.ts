import { TagGroup, TagObject } from "../types/tags"
interface TagSystem {
    [name: string]: TagGroup
}

export const AgentTags: TagObject[] = [
    {tag:"astra",displayName:"Astra",description:"Player is playing Astra", unique: true, keybind: "", id: "a001"},
    {tag:"brimstone",displayName:"Brimstone",description:"Player is playing Brimstone", unique: true, keybind: "", id: "a002"},
    {tag:"breach",displayName:"Breach",description:"Player is playing Breach", unique: true, keybind: "", id: "a003"},
    {tag:"chamber",displayName:"Chamber",description:"Player is playing Chamber", unique: true, keybind: "", id: "a004"},
    {tag:"cypher",displayName:"Cypher",description:"Player is playing Cypher", unique: true, keybind: "", id: "a005"},
    {tag:"deadlock",displayName:"Deadlock",description:"Player is playing Deadlock", unique: true, keybind: "", id: "a006"},
    {tag:"fade",displayName:"Fade",description:"Player is playing Fade", unique: true, keybind: "", id: "a007"},
    {tag:"gekko",displayName:"Gekko",description:"Player is playing Gekko", unique: true, keybind: "", id: "a008"},
    {tag:"harbor",displayName:"Harbor",description:"Player is playing Harbor", unique: true, keybind: "", id: "a009"},
    {tag:"iso",displayName:"Iso",description:"Player is playing Iso", unique: true, keybind: "", id: "a010"},
    {tag:"jett",displayName:"Jett",description:"Player is playing Jett", unique: true, keybind: "", id: "a011"},
    {tag:"kayo",displayName:"Kayo",description:"Player is playing KAY/O", unique: true, keybind: "", id: "a012"},
    {tag:"killjoy",displayName:"Killjoy",description:"Player is playing Killjoy", unique: true, keybind: "", id: "a013"},
    {tag:"neon",displayName:"Neon",description:"Player is playing Neon", unique: true, keybind: "", id: "a014"},
    {tag:"omen",displayName:"Omen",description:"Player is playing Omen", unique: true, keybind: "", id: "a015"},
    {tag:"phoenix",displayName:"Phoenix",description:"Player is playing Phoenix", unique: true, keybind: "", id: "a016"},
    {tag:"raze",displayName:"Raze",description:"Player is playing Raze", unique: true, keybind: "", id: "a017"},
    {tag:"reyna",displayName:"Reyna",description:"Player is playing Reyna", unique: true, keybind: "", id: "a018"},
    {tag:"sage",displayName:"Sage",description:"Player is playing Sage", unique: true, keybind: "", id: "a019"},
    {tag:"skye",displayName:"Skye",description:"Player is playing Skye", unique: true, keybind: "", id: "a020"},
    {tag:"sova",displayName:"Sova",description:"Player is playing Sova", unique: true, keybind: "", id: "a021"},
    {tag:"viper",displayName:"Viper",description:"Player is playing Viper", unique: true, keybind: "", id: "a022"},
    {tag:"yoru",displayName:"Yoru",description:"Player is playing Yoru", unique: true, keybind: "", id: "a023"}
]
export const MapTags: TagObject[] = [
    {tag:"abyss",displayName:"Abyss",description:"Clip takes place on Abyss", unique: true, keybind: "", id: "m001"},
    {tag:"ascent",displayName:"Ascent",description:"Clip takes place on Ascent", unique: true, keybind: "", id: "m002"},
    {tag:"bind",displayName:"Bind",description:"Clip takes place on Bind", unique: true, keybind: "", id: "m003"},
    {tag:"breeze",displayName:"Breeze",description:"Clip takes place on Breeze", unique: true, keybind: "", id: "m004"},
    {tag:"fracture",displayName:"Fracture",description:"Clip takes place on Fracture", unique: true, keybind: "", id: "m005"},
    {tag:"haven",displayName:"Haven",description:"Clip takes place on Haven", unique: true, keybind: "", id: "m006"},
    {tag:"icebox",displayName:"Icebox",description:"Clip takes place on Icebox", unique: true, keybind: "", id: "m007"},
    {tag:"lotus",displayName:"Lotus",description:"Clip takes place on Lotus", unique: true, keybind: "", id: "m008"},
    {tag:"pearl",displayName:"Pearl",description:"Clip takes place on Pearl", unique: true, keybind: "", id: "m009"},
    {tag:"split",displayName:"Split",description:"Clip takes place on Split", unique: true, keybind: "", id: "m010"},
    {tag:"sunset",displayName:"Sunset",description:"Clip takes place on Sunset", unique: true, keybind: "", id: "m011"}
]
export const GenericTags: TagSystem = {
    guns: {
        tags: [
            {tag:"ares",displayName:"Ares",description:"Player gets a kill with the Ares", unique: true, keybind: "a", id: "g001"},
            {tag:"bucky",displayName:"Bucky",description:"Player gets a kill with the Bucky", unique: true, keybind: "b", id: "g002"},
            {tag:"bulldog",displayName:"Bulldog",description:"Player gets a kill with the Bulldog", unique: true, keybind: "l", id: "g003"},
            {tag:"classic",displayName:"Classic",description:"Player gets a kill with the Classic", unique: true, keybind: "c", id: "g004"},
            {tag:"frenzy",displayName:"Frenzy",description:"Player gets a kill with the Frenzy", unique: true, keybind: "f", id: "g005"},
            {tag:"ghost",displayName:"Ghost",description:"Player gets a kill with the Ghost", unique: true, keybind: "g", id: "g006"},
            {tag:"guardian",displayName:"Guardian",description:"Player gets a kill with the Guardian", unique: true, keybind: "d", id: "g007"},
            {tag:"judge",displayName:"Judge",description:"Player gets a kill with the Judge", unique: true, keybind: "j", id: "g008"},
            {tag:"marshal",displayName:"Marshal",description:"Player gets a kill with the Marshal", unique: true, keybind: "m", id: "g009"},
            {tag:"operator",displayName:"Operator",description:"Player gets a kill with the Operator", unique: true, keybind: "o", id: "g010"},
            {tag:"odin",displayName:"Odin",description:"Player gets a kill with the Odin", unique: true, keybind: "i", id: "g011"},
            {tag:"phantom",displayName:"Phantom",description:"Player gets a kill with the Phantom", unique: true, keybind: "p", id: "g012"},
            {tag:"sheriff",displayName:"Sheriff",description:"Player gets a kill with the Sheriff", unique: true, keybind: "s", id: "g013"},
            {tag:"shorty",displayName:"Shorty",description:"Player gets a kill with the Shorty", unique: true, keybind: "r", id: "g014"},
            {tag:"spectre",displayName:"Spectre",description:"Player gets a kill with the Spectre", unique: true, keybind: "c", id: "g015"},
            {tag:"stinger",displayName:"Stinger",description:"Player gets a kill with the Stinger", unique: true, keybind: "t", id: "g016"},
            {tag:"vandal",displayName:"Vandal",description:"Player gets a kill with the Vandal", unique: true, keybind: "v", id: "g017"},
            {tag:"knife",displayName:"Knife",description:"Player gets a kill with their Knife", unique: true, keybind: "k", id: "g018"}
        ],
        keybindGroup: "g",
        exclusive: false,
        iterable: false,
        id: "g03"
    },
    statusEffects:{
        tags: [
            {tag:"nearsighted",displayName:"Near-Sighted",description:"Player gets near-sighted", unique: false, keybind: "n", id: "s001"},
            {tag:"blinded",displayName:"Blinded",description:"Player gets blinded", unique: false, keybind: "b", id: "s002"},
            {tag:"stunned",displayName:"Stunned",description:"Player gets stunned", unique: false, keybind: "s", id: "s003"},
            {tag:"deafened",displayName:"Deafened",description:"player gets deafened", unique: false, keybind: "f", id: "s004"},
            {tag:"decayed",displayName:"Decayed",description:"Player gets decayed", unique: false, keybind: "d", id: "s005"},
            {tag:"trailed",displayName:"Trailed",description:"player gets trailed", unique: false, keybind: "t", id: "s006"},
            {tag:"supressed",displayName:"Supressed",description:"Player is supressed", unique: false, keybind: "p", id: "s007"},
            {tag:"detained",displayName:"Detained",description:"Player is detained", unique: false, keybind: "n", id: "s008"},
            {tag:"healed",displayName:"Healed",description:"Player gets healing from an ally", unique: false, keybind: "h", id: "s009"},
            {tag:"pinged",displayName:"Pinged",description:"Player gets pinged", unique: false, keybind: "g", id: "s010"},
            {tag:"slowed",displayName:"Slowed",description:"Player is slowed", unique: false, keybind: "w", id: "s011"},
            {tag:"revived",displayName:"Revived",description:"Player revives", unique: false, keybind: "x", id: "s0012"},
            {tag:"vulnerable",displayName:"Vulnerable",description:"Player get vulnerable", unique: false, keybind: "v", id: "s0013"},
            {tag:"displaced",displayName:"Displaced",description:"Player is displaced", unique: false, keybind: "c", id: "s0014"},
            {tag:"stimmed",displayName:"Stimmed",description:"Player is stimmed", unique: false, keybind: "m", id: "s0015"}
        ],
        keybindGroup: "s",
        exclusive: false,
        iterable: false,
        id: "g04"
    },
    clipType:{
        tags: [
            {tag:"cclip",displayName:"Custom Clip",description:"Clip is a custom clip", unique: true, keybind: "c", id: "c001"},
            {tag:"igclip",displayName:"In-Game Clip",description:"Clip showcases a real game", unique: true, keybind: "i", id: "c002"},
            {tag:"deathmatch",displayName:"Death match",description:"Clip comes from a deathmatch", unique: true, keybind: "d", id: "c004"}
        ],
        keybindGroup: "c",
        exclusive: true,
        iterable: false,
        id: "g05"
    },
    abilities:{
        tags: [
            {tag:"ult",displayName:"Ultimate",description:"Player casted their ultimate", unique: true, keybind: "x", id: "a001"},
            {tag:"ckey",displayName:"C key",description:"Player casted their C ability", unique: false, keybind: "c", id: "a002"},
            {tag:"qkey",displayName:"Q key",description:"Player casted their Q ability", unique: false, keybind: "q", id: "a003"},
            {tag:"ekey",displayName:"E key",description:"Player casted their E ability", unique: false, keybind: "e", id: "a004"},
        ],
        keybindGroup: "a",
        exclusive: false,
        iterable: false,
        id: "g06"
    },
    kda:{                
        tags: [
            {tag:"kill",displayName:"Kill",description:"Player got a kill", unique: false, keybind: "k", id: "k001"},
            {tag:"death",displayName:"Death",description:"Player gets killed", unique: false, keybind: "d", id: "k002"},
            {tag:"ace",displayName:"Ace",description:"Player gets an ace", unique: true, keybind: "x", id: "k007"},
            {tag:"opd",displayName:"Ppped",description:"Player got killed by an Operator", unique: false, keybind: "o", id: "k008"},
            {tag:"kba",displayName:"Kill by Ability",description:"Player gets a kill with the one of their abilities", unique: false, keybind: "a", id: "k009"}
        ],
        keybindGroup: "k",
        exclusive: false,
        iterable: false,
        id: "g07"
    },
    playerSide:{
        tags: [
            {tag:"attk",displayName:"Attacker",description:"Player is an attacker", unique: true, keybind: "a", id: "s001"},
            {tag:"def",displayName:"Defender",description:"Player is a defender", unique: true, keybind: "d", id: "s002"}
        ],
        keybindGroup: "p",
        exclusive: true,
        iterable: false,
        id: "g08"
    },
    mapAreas:{
        tags: [
            {tag:"asite",displayName:"A site",description:"Important action occurs at or near A Site", unique: true, keybind: "a", id: "z001"},
            {tag:"bsite",displayName:"B site",description:"Important action occurs at or near B Site", unique: true, keybind: "b", id: "z002"},
            {tag:"csite",displayName:"C site",description:"Important action occurs at or near C Site", unique: true, keybind: "c", id: "z003"},
            {tag:"mid",displayName:"",description:"Important action occurs at or near mid", unique: true, keybind: "m", id: "z004"},
            {tag:"aspawn",displayName:"attacker-spawn",description:"Important action occurs at or near Attacker Spawn", unique: true, keybind: "x", id: "z005"},
            {tag:"dspawn",displayName:"defender-spawn",description:"Important action occurs at or near Defender Spawn", unique: true, keybind: "o", id: "z006"},
        ],
        keybindGroup: "n",
        exclusive: false,
        iterable: false,
        id: "g09"
    },
    mechanics:{
        tags: [
            {tag:"jigglepeak",displayName:"Jiggle Peak",description:"Player jiggle peeks at some point", unique: false, keybind: "j", id: "n001"},
            {tag:"headshot",displayName:"Headshot",description:"Player gets a headshot kill", unique: false, keybind: "h", id: "n002"},
            {tag:"swing",displayName:"Swing",description:"Player wide-swings an angle", unique: false, keybind: "s", id: "n003"},
            {tag:"trade",displayName:"Trade",description:"Player got a kill by trading an ally", unique: false, keybind: "t", id: "n004"},
            {tag:"wb",displayName:"Wall Bang",description:"Player got a kill by shooting through an obstacle", unique: false, keybind: "w", id: "n005"},
            {tag:"bk",displayName:"Blind Kill",description:"Player got a kill without vision of the enemy", unique: false, keybind: "b", id: "n006"}
        ],
        keybindGroup: "m",
        exclusive: false,
        iterable: false,
        id: "g11"
    },
    gameObjects:{
        tags: [
            {tag:"ultorb",displayName:"Ultimate Orb",description:"Player acquired an ultimate orb", unique: false, keybind: "o", id: "o001"}
        ],
        keybindGroup: "o",
        exclusive: false,
        iterable: false,
        id: "g12"
    },
    gameEvents:{
        tags: [
            {tag:"spikeplant",displayName:"Planted Spike",description:"Player planted the spike", unique: true, keybind: "p", id: "e001"},
            {tag:"spikedefuse",displayName:"Defused Spike",description:"Player defused the spike", unique: true, keybind: "d", id: "e002"},
            {tag:"clutch",displayName:"Clutch",description:"Player clutched the round", unique: true, keybind: "c", id: "e003"},
            {tag:"spikeblow",displayName:"Spike Blow",description:"Spike goes off during the clip", unique: true, keybind: "x", id: "e004"},
            {tag:"tp",displayName:"Teleportation",description:"Player teleported using an ability or going through a teleporter", unique: false, keybind: "t", id: "e005"},
            {tag:"thrifty",displayName:"Thrifty",description:"Player's team won round where their team were on a resource disadvantage", unique: true, keybind: "c", id: "e006"},
            {tag:"flawless",displayName:"Flawless",description:"Player's team won round with no casualty", unique: true, keybind: "f", id: "e012"},
            {tag:"won",displayName:"Won Game",description:"Player's team won the match on this round", unique: true, keybind: "v", id: "e013"},
            {tag:"defeat",displayName:"",description:"Player's team lost the match on this round", unique: true, keybind: "d", id: "e014"},
            {tag:"winround",displayName:"Won Round",description:"Player's team won this round", unique: true, keybind: "w", id: "e015"},
            {tag:"lostround",displayName:"Lost Round",description:"Player's team lost this round", unique: true, keybind: "l", id: "e016"}
        ],
        keybindGroup: "e",
        exclusive: false,
        iterable: false,
        id: "g13"
    },
    fights:{
        tags: [
            {tag:"1v1",displayName:"1v1",description:"Player won a round where they were the last man standing against 1 opponent", unique: false, keybind: "1", id: "e007"},
            {tag:"1v2",displayName:"1v2",description:"Player won a round where they were the last man standing against 2 opponents", unique: false, keybind: "2", id: "e008"},
            {tag:"1v3",displayName:"1v3",description:"Player won a round where they were the last man standing against 3 opponents", unique: true, keybind: "3", id: "e009"},
            {tag:"1v4",displayName:"1v4",description:"Player won a round where they were the last man standing against 4 opponents", unique: true, keybind: "4", id: "e010"},
            {tag:"1v5",displayName:"1v5",description:"Player won a round where they were the last man standing against 5 opponents", unique: true, keybind: "5", id: "e011"},
        ],
        keybindGroup: "f",
        exclusive: false,
        iterable: false,
        id: "g14"
    },
    gameTactics:{
        tags: [
            {tag:"anchor",displayName:"Anchor",description:"Player was defending a site from inside", unique: false, keybind: "a", id: "t001"},
            {tag:"execute",displayName:"Execute",description:"Player's team coordinate to rush into a site", unique: false, keybind: "x", id: "t002"},
            {tag:"rotation",displayName:"Rotation",description:"Player rotates to another site", unique: false, keybind: "r", id: "t003"},
            {tag:"lurker",displayName:"Lurker",description:"Player is lurking", unique: false, keybind: "l", id: "t004"},
            {tag:"teamplay",displayName:"Team Play",description:"Clip showcases a successful team play", unique: false, keybind: "t", id: "t005"},
            {tag:"retake",displayName:"Retake",description:"Player attempts to retake a site where the spike has been planted", unique: false, keybind: "g", id: "t006"},
            {tag:"pplant",displayName:"Post-Plant",description:"Important action occurs while planted spike counts down", unique: true, keybind: "p", id: "t007"},
            {tag:"lineup",displayName:"Line-Up",description:"Player performs a line-up ability cast", unique: false, keybind: "l", id: "t008"}
        ],
        keybindGroup: "t",
        exclusive: false,
        iterable: false,
        id: "g15"
    }
}
export const privateTags: TagObject[] = [
    {tag:"duelist",displayName:"Duelist",description:"Player is playing a duelist", unique: true, keybind: "d", id: "r001"},
    {tag:"controller",displayName:"Controller",description:"Player is playing a controller", unique: true, keybind: "c", id: "r002"},
    {tag:"sentinel",displayName:"Sentinel",description:"Player is playing a sentinel", unique: true, keybind: "s", id: "r003"},
    {tag:"initiator",displayName:"Initiator",description:"Player is playing an initiator", unique: true, keybind: "i", id: "r004"},
    {tag:"mk",displayName:"Multi Kill",description:"Player gets a multi-kill", unique: true, keybind: "", id: "k003"},
    {tag:"2k",displayName:"Double kill",description:"Player gets a double-kill", unique: true, keybind: "", id: "k004"},
    {tag:"3k",displayName:"Triple kill",description:"Player gets a triple-kill", unique: true, keybind: "", id: "k005"},
    {tag:"4k",displayName:"Quadra kill",description:"Player gets a quadra-kill", unique: true, keybind: "", id: "k006"},
    {tag:"molly",displayName:"Molly",description:"Player casted a molly ability", unique: false, keybind: "", id: "a005"},
    {tag:"smoke",displayName:"Smoke",description:"Player casted a smoke ability", unique: false, keybind: "", id: "a006"},
    {tag:"wall",displayName:"Wall",description:"Player casted a walling ability", unique: false, keybind: "", id: "a007"},
    {tag:"flash",displayName:"Flash",description:"Player casted a flashing or near-sighting ability", unique: false, keybind: "", id: "a008"},
    {tag:"aside",displayName:"A Side",description:"Important action occurs on the A half of the map", unique: true, keybind: "", id: "z007"},
    {tag:"bside",displayName:"B Side",description:"Important action occurs on the B half of the map", unique: true, keybind: "", id: "z008"},
    {tag:"hell",displayName:"Hell",description:"Important action occurs on 'hell'", unique: true, keybind: "", id: "z009"},
    {tag:"heaven",displayName:"Heaven",description:"Important action occurs on 'heaven", unique: true, keybind: "", id: "z010"},
    {tag:"garage",displayName:"Garage",description:"Important action occurs on 'garage", unique: true, keybind: "", id: "z011"}
]