#pragma once

struct Player;
#include "auraStats.h"
#include <iostream>

struct Trinket
{
    Player* player;
    AuraStats* stats;
    int duration;
    int durationRemaining;
    int cooldown;
    int cooldownRemaining;
    bool active;
    bool sharesCooldown;
    std::string name;
    std::string varName;

    Trinket(Player* player);
    bool ready();
    void reset();
    void setup();
    void use();
    void fade(bool endOfIteration = false);
    void tick(int time);
};

struct RestrainedEssenceOfSapphiron : public Trinket
{
    RestrainedEssenceOfSapphiron(Player* player);
};

struct ShiftingNaaruSliver : public Trinket
{
    ShiftingNaaruSliver(Player* player);
};

struct SkullOfGuldan : public Trinket
{
    SkullOfGuldan(Player* player);
};

struct HexShrunkenHead : public Trinket
{
    HexShrunkenHead(Player* player);
};

struct IconOfTheSilverCrescent : public Trinket
{
    IconOfTheSilverCrescent(Player* player);
};

struct ScryersBloodgem : public Trinket
{
    ScryersBloodgem(Player* player);
};

struct AncientCrystalTalisman : public Trinket
{
    AncientCrystalTalisman(Player* player);
};

struct ArcanistsStone : public Trinket
{
    ArcanistsStone(Player* player);
};

struct TerokkarTabletOfVim : public Trinket
{
    TerokkarTabletOfVim(Player* player);
};

struct XirisGift : public Trinket
{
    XirisGift(Player* player);
};

struct VengeanceOfTheIllidari : public Trinket
{
    VengeanceOfTheIllidari(Player* player);
};

struct FigurineLivingRubySerpent : public Trinket
{
    FigurineLivingRubySerpent(Player* player);
};

struct EssenceOfTheMartyr : public Trinket
{
    EssenceOfTheMartyr(Player* player);
};

struct StarkillersBauble : public Trinket
{
    StarkillersBauble(Player* player);
};