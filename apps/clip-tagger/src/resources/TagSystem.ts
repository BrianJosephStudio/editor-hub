import { TagGroup, TagObject } from "../types/tags"
interface TagSystem {
    [name: string]: TagGroup
}

export const AgentTags: TagObject[] = [
    {tag:"astra",displayName:"Astra",description:"Player is playing Astra", keybind: "", id: "a001"},
    {tag:"brimstone",displayName:"Brimstone",description:"Player is playing Brimstone", keybind: "", id: "a002"},
    {tag:"breach",displayName:"Breach",description:"Player is playing Breach", keybind: "", id: "a003"},
    {tag:"chamber",displayName:"Chamber",description:"Player is playing Chamber", keybind: "", id: "a004"},
    {tag:"cypher",displayName:"Cypher",description:"Player is playing Cypher", keybind: "", id: "a005"},
    {tag:"deadlock",displayName:"Deadlock",description:"Player is playing Deadlock", keybind: "", id: "a006"},
    {tag:"fade",displayName:"Fade",description:"Player is playing Fade", keybind: "", id: "a007"},
    {tag:"gekko",displayName:"Gekko",description:"Player is playing Gekko", keybind: "", id: "a008"},
    {tag:"harbor",displayName:"Harbor",description:"Player is playing Harbor", keybind: "", id: "a009"},
    {tag:"iso",displayName:"Iso",description:"Player is playing Iso", keybind: "", id: "a010"},
    {tag:"jett",displayName:"Jett",description:"Player is playing Jett", keybind: "", id: "a011"},
    {tag:"kayo",displayName:"Kayo",description:"Player is playing KAY/O", keybind: "", id: "a012"},
    {tag:"killjoy",displayName:"Killjoy",description:"Player is playing Killjoy", keybind: "", id: "a013"},
    {tag:"neon",displayName:"Neon",description:"Player is playing Neon", keybind: "", id: "a014"},
    {tag:"omen",displayName:"Omen",description:"Player is playing Omen", keybind: "", id: "a015"},
    {tag:"phoenix",displayName:"Phoenix",description:"Player is playing Phoenix", keybind: "", id: "a016"},
    {tag:"raze",displayName:"Raze",description:"Player is playing Raze", keybind: "", id: "a017"},
    {tag:"reyna",displayName:"Reyna",description:"Player is playing Reyna", keybind: "", id: "a018"},
    {tag:"sage",displayName:"Sage",description:"Player is playing Sage", keybind: "", id: "a019"},
    {tag:"skye",displayName:"Skye",description:"Player is playing Skye", keybind: "", id: "a020"},
    {tag:"sova",displayName:"Sova",description:"Player is playing Sova", keybind: "", id: "a021"},
    {tag:"viper",displayName:"Viper",description:"Player is playing Viper", keybind: "", id: "a022"},
    {tag:"yoru",displayName:"Yoru",description:"Player is playing Yoru", keybind: "", id: "a023"}
]
export const MapTags: TagObject[] = [
    {tag:"abyss",displayName:"Abyss",description:"Clip takes place on Abyss", keybind: "", id: "m001"},
    {tag:"ascent",displayName:"Ascent",description:"Clip takes place on Ascent", keybind: "", id: "m002"},
    {tag:"bind",displayName:"Bind",description:"Clip takes place on Bind", keybind: "", id: "m003"},
    {tag:"breeze",displayName:"Breeze",description:"Clip takes place on Breeze", keybind: "", id: "m004"},
    {tag:"fracture",displayName:"Fracture",description:"Clip takes place on Fracture", keybind: "", id: "m005"},
    {tag:"haven",displayName:"Haven",description:"Clip takes place on Haven", keybind: "", id: "m006"},
    {tag:"icebox",displayName:"Icebox",description:"Clip takes place on Icebox", keybind: "", id: "m007"},
    {tag:"lotus",displayName:"Lotus",description:"Clip takes place on Lotus", keybind: "", id: "m008"},
    {tag:"pearl",displayName:"Pearl",description:"Clip takes place on Pearl", keybind: "", id: "m009"},
    {tag:"split",displayName:"Split",description:"Clip takes place on Split", keybind: "", id: "m010"},
    {tag:"sunset",displayName:"Sunset",description:"Clip takes place on Sunset", keybind: "", id: "m011"}
]
export const GenericTags: TagSystem = {
    guns: {
        tags: [
            {tag:"ares",displayName:"",description:"Player gets a kill with the Ares", keybind: "a", id: "g001"},
            {tag:"bucky",displayName:"",description:"Player gets a kill with the Bucky", keybind: "b", id: "g002"},
            {tag:"bulldog",displayName:"",description:"Player gets a kill with the Bulldog", keybind: "l", id: "g003"},
            {tag:"classic",displayName:"",description:"Player gets a kill with the Classic", keybind: "c", id: "g004"},
            {tag:"frenzy",displayName:"",description:"Player gets a kill with the Frenzy", keybind: "f", id: "g005"},
            {tag:"ghost",displayName:"",description:"Player gets a kill with the Ghost", keybind: "g", id: "g006"},
            {tag:"guardian",displayName:"",description:"Player gets a kill with the Guardian", keybind: "d", id: "g007"},
            {tag:"judge",displayName:"",description:"Player gets a kill with the Judge", keybind: "j", id: "g008"},
            {tag:"marshal",displayName:"",description:"Player gets a kill with the Marshal", keybind: "m", id: "g009"},
            {tag:"operator",displayName:"",description:"Player gets a kill with the Operator", keybind: "o", id: "g010"},
            {tag:"odin",displayName:"",description:"Player gets a kill with the Odin", keybind: "i", id: "g011"},
            {tag:"phantom",displayName:"",description:"Player gets a kill with the Phantom", keybind: "p", id: "g012"},
            {tag:"sheriff",displayName:"",description:"Player gets a kill with the Sheriff", keybind: "s", id: "g013"},
            {tag:"shorty",displayName:"",description:"Player gets a kill with the Shorty", keybind: "r", id: "g014"},
            {tag:"spectre",displayName:"",description:"Player gets a kill with the Spectre", keybind: "c", id: "g015"},
            {tag:"stinger",displayName:"",description:"Player gets a kill with the Stinger", keybind: "t", id: "g016"},
            {tag:"vandal",displayName:"",description:"Player gets a kill with the Vandal", keybind: "v", id: "g017"},
            {tag:"knife",displayName:"",description:"Player gets a kill with their Knife", keybind: "k", id: "g018"}
        ],
        keybindGroup: "g",
        unique: false,
        iterable: false,
        id: "g03"
    },
    statusEffects:{
        tags: [
            {tag:"nearsighted",displayName:"near-sighted",description:"Player gets near-sighted", keybind: "n", id: "s001"},
            {tag:"blinded",displayName:"",description:"Player gets blinded", keybind: "b", id: "s002"},
            {tag:"stunned",displayName:"",description:"Player gets stunned", keybind: "s", id: "s003"},
            {tag:"deafened",displayName:"",description:"player gets deafened", keybind: "f", id: "s004"},
            {tag:"decayed",displayName:"",description:"Player gets decayed", keybind: "d", id: "s005"},
            {tag:"trailed",displayName:"",description:"player gets trailed", keybind: "t", id: "s006"},
            {tag:"supressed",displayName:"",description:"Player is supressed", keybind: "p", id: "s007"},
            {tag:"detained",displayName:"",description:"Player is detained", keybind: "n", id: "s008"},
            {tag:"healed",displayName:"",description:"Player gets healing from an ally", keybind: "h", id: "s009"},
            {tag:"pinged",displayName:"",description:"Player gets pinged", keybind: "g", id: "s010"},
            {tag:"slowed",displayName:"",description:"Player is slowed", keybind: "w", id: "s011"},
            {tag:"revived",displayName:"",description:"Player revives", keybind: "x", id: "s0012"},
            {tag:"vulnerable",displayName:"",description:"Player get vulnerable", keybind: "v", id: "s0013"},
            {tag:"displaced",displayName:"",description:"Player is displaced", keybind: "c", id: "s0014"},
            {tag:"stimmed",displayName:"",description:"Player is stimmed", keybind: "m", id: "s0015"}
        ],
        keybindGroup: "s",
        unique: false,
        iterable: false,
        id: "g04"
    },
    clipType:{
        tags: [
            {tag:"cclip",displayName:"custom-clip",description:"Clip is a custom clip", keybind: "c", id: "c001"},
            {tag:"igclip",displayName:"in-game-clip",description:"Clip showcases a real game", keybind: "i", id: "c002"},
            {tag:"deathmatch",displayName:"",description:"Clip comes from a deathmatch", keybind: "d", id: "c004"}
        ],
        keybindGroup: "c",
        unique: true,
        iterable: false,
        id: "g05"
    },
    abilities:{
        tags: [
            {tag:"ult",displayName:"ultimate",description:"Player casted their ultimate", keybind: "x", id: "a001"},
            {tag:"ckey",displayName:"c-key",description:"Player casted their C ability", keybind: "c", id: "a002"},
            {tag:"qkey",displayName:"q-key",description:"Player casted their Q ability", keybind: "q", id: "a003"},
            {tag:"ekey",displayName:"e-key",description:"Player casted their E ability", keybind: "e", id: "a004"},
        ],
        keybindGroup: "a",
        unique: false,
        iterable: false,
        id: "g06"
    },
    kda:{                
        tags: [
            {tag:"kill",displayName:"",description:"Player got a kill", keybind: "k", id: "k001"},
            {tag:"death",displayName:"",description:"Player gets killed", keybind: "d", id: "k002"},
            {tag:"ace",displayName:"",description:"Player gets an ace", keybind: "x", id: "k007"},
            {tag:"opd",displayName:"opped",description:"Player got killed by an Operator", keybind: "o", id: "k008"},
            {tag:"kba",displayName:"kill-by-ability",description:"Player gets a kill with the one of their abilities", keybind: "a", id: "k009"}
        ],
        keybindGroup: "k",
        unique: false,
        iterable: false,
        id: "g07"
    },
    playerSide:{
        tags: [
            {tag:"attk",displayName:"attacker",description:"Player is an attacker", keybind: "a", id: "s001"},
            {tag:"def",displayName:"defender",description:"Player is a defender", keybind: "d", id: "s002"}
        ],
        keybindGroup: "p",
        unique: true,
        iterable: false,
        id: "g08"
    },
    mapAreas:{
        tags: [
            {tag:"asite",displayName:"a-site",description:"Important action occurs at or near A Site", keybind: "a", id: "z001"},
            {tag:"bsite",displayName:"b-site",description:"Important action occurs at or near B Site", keybind: "b", id: "z002"},
            {tag:"csite",displayName:"c-site",description:"Important action occurs at or near C Site", keybind: "c", id: "z003"},
            {tag:"mid",displayName:"",description:"Important action occurs at or near mid", keybind: "m", id: "z004"},
            {tag:"aspawn",displayName:"attacker-spawn",description:"Important action occurs at or near Attacker Spawn", keybind: "x", id: "z005"},
            {tag:"dspawn",displayName:"defender-spawn",description:"Important action occurs at or near Defender Spawn", keybind: "o", id: "z006"},
        ],
        keybindGroup: "n",
        unique: false,
        iterable: false,
        id: "g09"
    },
    mechanics:{
        tags: [
            {tag:"jigglepeak",displayName:"Jiggle Peak",description:"Player jiggle peeks at some point", keybind: "j", id: "n001"},
            {tag:"headshot",displayName:"Headshot",description:"Player gets a headshot kill", keybind: "h", id: "n002"},
            {tag:"swing",displayName:"Swing",description:"Player wide-swings an angle", keybind: "s", id: "n003"},
            {tag:"trade",displayName:"Trade",description:"Player got a kill by trading an ally", keybind: "t", id: "n004"},
            {tag:"wb",displayName:"Wall Bang",description:"Player got a kill by shooting through an obstacle", keybind: "w", id: "n005"},
            {tag:"bk",displayName:"Blind Kill",description:"Player got a kill without vision of the enemy", keybind: "b", id: "n006"}
        ],
        keybindGroup: "m",
        unique: false,
        iterable: false,
        id: "g11"
    },
    gameObjects:{
        tags: [
        {tag:"ultorb",displayName:"Ultimate Orb",description:"Player acquired an ultimate orb", keybind: "o", id: "o001"}
        ],
        keybindGroup: "o",
        unique: false,
        iterable: false,
        id: "g12"
    },
    gameEvents:{
        tags: [
            {tag:"spikeplant",displayName:"Planted Spike",description:"Player planted the spike", keybind: "p", id: "e001"},
            {tag:"spikedefuse",displayName:"Defused Spike",description:"Player defused the spike", keybind: "d", id: "e002"},
            {tag:"clutch",displayName:"Clutch",description:"Player clutched the round", keybind: "c", id: "e003"},
            {tag:"spikeblow",displayName:"Spike Blow",description:"Spike goes off during the clip", keybind: "x", id: "e004"},
            {tag:"tp",displayName:"Teleportation",description:"Player teleported using an ability or going through a teleporter", keybind: "t", id: "e005"},
            {tag:"thrifty",displayName:"Thrifty",description:"Player's team won round where their team were on a resource disadvantage", keybind: "c", id: "e006"},
            {tag:"flawless",displayName:"Flawless",description:"Player's team won round with no casualty", keybind: "f", id: "e012"},
            {tag:"won",displayName:"Won Game",description:"Player's team won the match on this round", keybind: "v", id: "e013"},
            {tag:"defeat",displayName:"",description:"Player's team lost the match on this round", keybind: "d", id: "e014"},
            {tag:"winround",displayName:"Won Round",description:"Player's team won this round", keybind: "w", id: "e015"},
            {tag:"lostround",displayName:"Lost Round",description:"Player's team lost this round", keybind: "l", id: "e016"}
        ],
        keybindGroup: "e",
        unique: false,
        iterable: false,
        id: "g13"
    },
    fights:{
        tags: [
            {tag:"1v1",displayName:"",description:"Player won a round where they were the last man standing against 1 opponent", keybind: "1", id: "e007"},
            {tag:"1v2",displayName:"",description:"Player won a round where they were the last man standing against 2 opponents", keybind: "2", id: "e008"},
            {tag:"1v3",displayName:"",description:"Player won a round where they were the last man standing against 3 opponents", keybind: "3", id: "e009"},
            {tag:"1v4",displayName:"",description:"Player won a round where they were the last man standing against 4 opponents", keybind: "4", id: "e010"},
            {tag:"1v5",displayName:"",description:"Player won a round where they were the last man standing against 5 opponents", keybind: "5", id: "e011"},
        ],
        keybindGroup: "f",
        unique: false,
        iterable: false,
        id: "g14"
    },
    gameTactics:{
        tags: [
            {tag:"anchor",displayName:"",description:"Player was defending a site from inside", keybind: "a", id: "t001"},
            {tag:"execute",displayName:"",description:"Player's team coordinate to rush into a site", keybind: "x", id: "t002"},
            {tag:"rotation",displayName:"",description:"Player rotates to another site", keybind: "r", id: "t003"},
            {tag:"lurker",displayName:"",description:"Player is lurking", keybind: "l", id: "t004"},
            {tag:"teamplay",displayName:"team-play",description:"Clip showcases a successful team play", keybind: "t", id: "t005"},
            {tag:"retake",displayName:"",description:"Player attempts to retake a site where the spike has been planted", keybind: "g", id: "t006"},
            {tag:"pplant",displayName:"post-plant",description:"Important action occurs while planted spike counts down", keybind: "p", id: "t007"},
            {tag:"lineup",displayName:"line-up",description:"Player performs a line-up ability cast", keybind: "l", id: "t008"}
        ],
        keybindGroup: "t",
        unique: false,
        iterable: false,
        id: "g15"
    }
}

export const privateTags: TagObject[] = [
    {tag:"duelist",displayName:"",description:"Player is playing a duelist", keybind: "d", id: "r001"},
    {tag:"controller",displayName:"",description:"Player is playing a controller", keybind: "c", id: "r002"},
    {tag:"sentinel",displayName:"",description:"Player is playing a sentinel", keybind: "s", id: "r003"},
    {tag:"initiator",displayName:"",description:"Player is playing an initiator", keybind: "i", id: "r004"},
    {tag:"mk",displayName:"multi-kill",description:"Player gets a multi-kill", keybind: "", id: "k003"},
    {tag:"2k",displayName:"double-kill",description:"Player gets a double-kill", keybind: "", id: "k004"},
    {tag:"3k",displayName:"triple-kill",description:"Player gets a triple-kill", keybind: "", id: "k005"},
    {tag:"4k",displayName:"quadra-kill",description:"Player gets a quadra-kill", keybind: "", id: "k006"},
    {tag:"molly",displayName:"",description:"Player casted a molly ability", keybind: "", id: "a005"},
    {tag:"smoke",displayName:"",description:"Player casted a smoke ability", keybind: "", id: "a006"},
    {tag:"wall",displayName:"",description:"Player casted a walling ability", keybind: "", id: "a007"},
    {tag:"flash",displayName:"",description:"Player casted a flashing or near-sighting ability", keybind: "", id: "a008"},
    {tag:"aside",displayName:"a-side",description:"Important action occurs on the A half of the map", keybind: "", id: "z007"},
    {tag:"bside",displayName:"b-side",description:"Important action occurs on the B half of the map", keybind: "", id: "z008"},
    {tag:"hell",displayName:"",description:"Important action occurs on 'hell'", keybind: "", id: "z009"},
    {tag:"heaven",displayName:"",description:"Important action occurs on 'heaven", keybind: "", id: "z010"},
    {tag:"garage",displayName:"",description:"Important action occurs on 'garage", keybind: "", id: "z011"}
]