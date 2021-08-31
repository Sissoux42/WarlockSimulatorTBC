#include "bindings.h"
#include "simulation.h"
#include "emscripten.h"
#include <emscripten/bind.h>
#include "constant.h"

/*void combatLogUpdate(char combatLogEntry)
{
    EM_ASM({
        postMessage({
            event: "combatLogUpdate",
            data: {
                combatLogEntry: UTF8ToString($0)
            }
        })
    }, combatLogEntry);
}*/

void simulationUpdate(int iteration, int iterationAmount, double medianDps, int itemId)
{
    EM_ASM({
        postMessage({
            event: "update",
            data: {
                medianDps: $0,
                iteration: $1,
                iterationAmount: $2,
                itemId: $3
            }
        })
    }, medianDps, iteration, iterationAmount, itemId);
}

void simulationEnd(double medianDps, double minDps, double maxDps, std::chrono::duration<double> duration, int itemId)
{
    EM_ASM({
        postMessage({
            event: "end",
            data: {
                medianDps: $0,
                minDps: $1,
                maxDps: $2,
                duration: $3,
                itemId: $4
            }
        })
    }, medianDps, minDps, maxDps, duration.count(), itemId);
}

EMSCRIPTEN_KEEPALIVE
void startSimulation(Simulation* sim)
{
    sim->start();
}

EMSCRIPTEN_KEEPALIVE
Items* allocItems(int head, int neck, int shoulders, int back, int chest, int bracers, int gloves, int belt, int legs, int boots
    , int finger1, int finger2, int trinket1, int trinket2, int mainHand, int offHand, int twoHand, int wand)
{
    return new Items(head, neck, shoulders, back, chest, bracers, gloves, belt, legs, boots, finger1, finger2, trinket1, trinket2, mainHand, offHand, twoHand, wand);
}

EMSCRIPTEN_KEEPALIVE
Auras* allocAuras(bool felArmor, bool blessingOfKings, bool blessingOfWisdom, bool judgementOfWisdom, bool manaSpringTotem, bool wrathOfAirTotem, bool totemOfWrath, bool markOfTheWild, bool arcaneIntellect
    , bool prayerOfFortitude, bool prayerOfSpirit, bool bloodPact, bool inspiringPresence, bool moonkinAura, bool powerInfusion, bool powerOfTheGuardianWarlock, bool powerOfTheGuardianMage, bool eyeOfTheNight
    , bool chainOfTheTwilightOwl, bool jadePendantOfBlasting, bool idolOfTheRavenGoddess, bool drumsOfBattle, bool drumsOfWar, bool drumsOfRestoration, bool bloodlust, bool ferociousInspiration
    , bool innervate, bool curseOfTheElements, bool shadowWeaving, bool improvedScorch, bool misery, bool judgementOfTheCrusader, bool vampiricTouch, bool flaskOfPureDeath, bool elixirOfMajorShadowPower
    , bool elixirOfMajorFirepower, bool greaterArcaneElixir, bool adeptsElixir, bool elixirOfDraenicWisdom, bool elixirOfMajorMageblood, bool superManaPotion, bool destructionPotion, bool brilliantWizardOil
    , bool superiorWizardOil, bool blessedWizardOil, bool demonicRune, bool flameCap, bool rumseyRumBlackLabel, bool kreegsStoutBeatdown, bool blackenedBasilisk, bool skullfishSoup, bool veryBerryCream
    , bool midsummerSausage, bool bloodthistle)
{
    return new Auras(felArmor, blessingOfKings, blessingOfWisdom, judgementOfWisdom, manaSpringTotem, wrathOfAirTotem, totemOfWrath, markOfTheWild, arcaneIntellect, prayerOfFortitude, prayerOfSpirit, bloodPact
    , inspiringPresence, moonkinAura, powerInfusion, powerOfTheGuardianWarlock, powerOfTheGuardianMage, eyeOfTheNight, chainOfTheTwilightOwl, jadePendantOfBlasting, idolOfTheRavenGoddess, drumsOfBattle
    , drumsOfWar, drumsOfRestoration, bloodlust, ferociousInspiration, innervate, curseOfTheElements, shadowWeaving, improvedScorch, misery, judgementOfTheCrusader, vampiricTouch, flaskOfPureDeath
    , elixirOfMajorShadowPower, elixirOfMajorFirepower, greaterArcaneElixir, adeptsElixir, elixirOfDraenicWisdom, elixirOfMajorMageblood, superManaPotion, destructionPotion, brilliantWizardOil, superiorWizardOil
    , blessedWizardOil, demonicRune, flameCap, rumseyRumBlackLabel, kreegsStoutBeatdown, blackenedBasilisk, skullfishSoup, veryBerryCream, midsummerSausage, bloodthistle);
}

EMSCRIPTEN_KEEPALIVE
Talents* allocTalents(int suppression, int improvedCorruption, int improvedLifeTap, int improvedCurseOfAgony, int amplifyCurse, int nightfall, int empoweredCorruption, int siphonLife, int shadowMastery, int contagion
    , int darkPact, int unstableAffliction, int improvedImp, int demonicEmbrace, int felIntellect, int felStamina, int improvedSuccubus, int demonicAegis, int unholyPower, int demonicSacrifice, int manaFeed
    , int masterDemonologist, int soulLink, int demonicKnowledge, int demonicTactics, int felguard, int improvedShadowBolt, int cataclysm, int bane, int improvedFirebolt, int improvedLashOfPain, int devastation
    , int shadowburn, int improvedSearingPain, int improvedImmolate, int ruin, int emberstorm, int backlash, int conflagrate, int shadowAndFlame, int shadowfury)
{
    return new Talents(suppression, improvedCorruption, improvedLifeTap, improvedCurseOfAgony, amplifyCurse, nightfall, empoweredCorruption, siphonLife, shadowMastery, contagion, darkPact, unstableAffliction
    , improvedImp, demonicEmbrace, felIntellect, felStamina, improvedSuccubus, demonicAegis, unholyPower, demonicSacrifice, manaFeed, masterDemonologist, soulLink, demonicKnowledge, demonicTactics
    , felguard, improvedShadowBolt, cataclysm, bane, improvedFirebolt, improvedLashOfPain, devastation, shadowburn, improvedSearingPain, improvedImmolate, ruin, emberstorm, backlash, conflagrate, shadowAndFlame, shadowfury);
}

EMSCRIPTEN_KEEPALIVE
Sets* allocSets(int plagueheart, int spellfire, int frozenShadoweave, int spellstrike, int oblivion, int manaEtched, int twinStars, int t4, int t5, int t6)
{
    return new Sets(plagueheart, spellfire, frozenShadoweave, spellstrike, oblivion, manaEtched, twinStars, t4, t5, t6);
}

EMSCRIPTEN_KEEPALIVE
CharacterStats* allocStats(int health, int mana, double stamina, double intellect, double spirit, double spellPower, int shadowPower, int firePower, int hasteRating, int hitRating, int critRating, double critPercent,
    int mp5, int spellPen, double fireModifier, double frostModifier, double hastePercent, double damageModifier, double shadowModifier, double staminaModifier, double intellectModifier,
    double spiritModifier, double manaCostModifier, double arcaneModifier, double natureModifier, int natureResist, int arcaneResist, int fireResist, int frostResist, int shadowResist)
{
    return new CharacterStats(health, mana, stamina, intellect, spirit, spellPower, shadowPower, firePower, hasteRating, hitRating, critRating, critPercent, mp5, spellPen, fireModifier, frostModifier, hastePercent
    , damageModifier, shadowModifier, staminaModifier, intellectModifier, spiritModifier, manaCostModifier, arcaneModifier, natureModifier, natureResist, arcaneResist, fireResist, frostResist, shadowResist);
}

EMSCRIPTEN_KEEPALIVE
PlayerSettings* allocPlayerSettings(Auras* auras, Talents* talents, Sets* sets, CharacterStats* stats, Items* items, int itemId, int metaGemId, bool isAldor, int enemyLevel, int enemyShadowResist, int enemyFireResist
        , int mageAtieshAmount, int totemOfWrathAmount, bool sacrificingPet, bool petIsImp, bool petIsSuccubus, bool petIsFelguard, int ferociousInspirationAmount, int improvedCurseOfTheElements
        , bool usingCustomIsbUptime, int customIsbUptimeValue, int improvedDivineSpirit, int improvedImp, int shadowPriestDps, int warlockAtieshAmount, int improvedExposeArmor, bool isSingleTarget, int enemyAmount
        , bool isOrc, int powerInfusionAmount, bool bloodlustAmount, bool innervateAmount, int enemyArmor, int exposeWeaknessUptime, bool improvedFaerieFire, bool infinitePlayerMana, bool infinitePetMana
        , bool usingLashOfPainOnCooldown, bool petIsAggressive, bool prepopBlackBook, bool randomizeValues, bool userChoosingRotation, bool exaltedWithShattrathFaction, int survivalHunterAgility, bool hasImmolate
        , bool hasCorruption, bool hasSiphonLife, bool hasUnstableAffliction, bool hasSearingPain, bool hasShadowBolt, bool hasIncinerate, bool hasCurseOfRecklessness, bool hasCurseOfTheElements, bool hasCurseOfAgony
        , bool hasCurseOfDoom, bool hasDeathCoil, bool hasShadowburn, bool hasConflagrate, bool hasShadowfury, bool hasAmplifyCurse, bool hasDarkPact)
{
    return new PlayerSettings(auras, talents, sets, stats, items, itemId, metaGemId, isAldor, enemyLevel, enemyShadowResist, enemyFireResist, mageAtieshAmount, totemOfWrathAmount, sacrificingPet, petIsImp, petIsSuccubus
        , petIsFelguard, ferociousInspirationAmount, improvedCurseOfTheElements, usingCustomIsbUptime, customIsbUptimeValue, improvedDivineSpirit, improvedImp, shadowPriestDps, warlockAtieshAmount
        , improvedExposeArmor, isSingleTarget, enemyAmount, isOrc, powerInfusionAmount, bloodlustAmount, innervateAmount, enemyArmor, exposeWeaknessUptime, improvedFaerieFire, infinitePlayerMana, infinitePetMana
        , usingLashOfPainOnCooldown, petIsAggressive, prepopBlackBook, randomizeValues, userChoosingRotation, exaltedWithShattrathFaction, survivalHunterAgility, hasImmolate, hasCorruption, hasSiphonLife
        , hasUnstableAffliction, hasSearingPain, hasShadowBolt, hasIncinerate, hasCurseOfRecklessness, hasCurseOfTheElements, hasCurseOfAgony, hasCurseOfDoom, hasDeathCoil, hasShadowburn, hasConflagrate
        , hasShadowfury, hasAmplifyCurse, hasDarkPact);
}

EMSCRIPTEN_KEEPALIVE
Player* allocPlayer(PlayerSettings* settings)
{
    return new Player(settings);
}

EMSCRIPTEN_KEEPALIVE
SimulationSettings* allocSimSettings(int iterations, int minTime, int maxTime)
{
    return new SimulationSettings(iterations, minTime, maxTime);
}

EMSCRIPTEN_KEEPALIVE
Simulation* allocSim(Player* player, SimulationSettings* simulationSettings)
{
    return new Simulation(player, simulationSettings);
}

EMSCRIPTEN_KEEPALIVE
void freeItems(Items* items)
{
    delete items;
}

EMSCRIPTEN_KEEPALIVE
void freeAuras(Auras* auras)
{
    delete auras;
}

EMSCRIPTEN_KEEPALIVE
void freeTalents(Talents* talents)
{
    delete talents;
}

EMSCRIPTEN_KEEPALIVE
void freeSets(Sets* sets)
{
    delete sets;
}

EMSCRIPTEN_KEEPALIVE
void freeStats(CharacterStats* stats)
{
    delete stats;
}

EMSCRIPTEN_KEEPALIVE
void freePlayerSettings(PlayerSettings* settings)
{
    delete settings;
}

EMSCRIPTEN_KEEPALIVE
void freePlayer(Player* player)
{
    delete player;
}

EMSCRIPTEN_KEEPALIVE
void freeSimSettings(SimulationSettings* settings)
{
    delete settings;
}

EMSCRIPTEN_KEEPALIVE
void freeSim(Simulation* sim)
{
    delete sim;
}

// I gave up on trying to get embind to work, but it would be better to handle it this way than using a bunch of booleans in the PlayerSettings struct
/*EMSCRIPTEN_BINDINGS(module)
{
    emscripten::enum_<Constant>("Constant")
        .value("ALDOR", ALDOR)
        .value("Scryers", SCRYER)
        .value("yes", YES)
        .value("no", NO)
        .value("onCooldown", ON_COOLDOWN)
        .value("singleTarget", SINGLE_TARGET)
        .value("aoe", AOE)
        .value("noISB", NO_ISB)
        .value("human", HUMAN)
        .value("gnome", GNOME)
        .value("orc", ORC)
        .value("undead", UNDEAD)
        .value("bloodElf", BLOOD_ELF)
        .value("simChooses", SIM_CHOOSES)
        .value("userChooses", USER_CHOOSES)
        ;

    emscripten::value_object<AdditionalPlayerSettings>("AdditionalPlayerSettings")
        .field("shattrathFaction", &AdditionalPlayerSettings::shattrathFaction)
        .field("race", &AdditionalPlayerSettings::race)
        .field("sacrificePet", &AdditionalPlayerSettings::sacrificePet)
        .field("improvedFaerieFire", &AdditionalPlayerSettings::improvedFaerieFire)
        .field("lashOfPainUsage", &AdditionalPlayerSettings::lashOfPainUsage)
        .field("shattrathFactionReputation", &AdditionalPlayerSettings::exaltedWithShattrathFaction)
        .field("customIsbUptime", &AdditionalPlayerSettings::usingCustomIsbUptime)
        .field("randomizeValues", &AdditionalPlayerSettings::randomizeValues)
        .field("infinitePlayerMana", &AdditionalPlayerSettings::infinitePlayerMana)
        .field("infinitePetMana", &AdditionalPlayerSettings::infinitePetMana)
        .field("prepopBlackBook", &AdditionalPlayerSettings::prepopBlackBook)
        .field("rotationOption", &AdditionalPlayerSettings::rotationOption)
        .field("fightType", &AdditionalPlayerSettings::fightType)
        ;
}*/