export interface Item {
    id: number,
    tier: number,
    name: string,
    copies: number,
    stats: {
        tai: number,
        nin: number,
        buki: number,
        sta: number,
        gen: number,
        ele: number,
        crit: number,
        reroll: number,
        atk: number,
    },
    extra_stats: {
      wind_damage: number,
      water_damage: number,
      fire_damage: number,
      earth_damage: number,
      lightning_damage: number,
      poison: number,
      critical_chance: number,
      itemfind: number,
      experience: number,
      gold: number,
      focus_burst: number,
      genjutsu_absorb: number,
      genjutsu_activation: number,
      bukijutsu_recovery: number,
      bukijutsu_boost: number,
      bukijutsu_max_recovery: number,
      bloodline_exp: number,
      lightning_element: number,
      wind_element: number,
      tai_guard: number,
      nin_absorb: number,
      death: number,
      taijutsu_immunity: number,
    },
    genjutsu: Genjutsu[]
}

export interface TableItem {
    id: number;
    name: string;
    tai: number;
    nin: number;
    buki: number;
    sta: number;
    gen: number;
    ele: number;
    crit: number;
    reroll: number;
    atk: number;
    wind_damage: number;
    water_damage: number;
    fire_damage: number;
    earth_damage: number;
    lightning_damage: number;
    poison: number;
    critical_chance: number;
    itemfind: number;
    experience: number;
    gold: number;
    focus_burst: number;
    genjutsu_absorb: number;
    genjutsu_activation: number;
    bukijutsu_recovery: number;
    bukijutsu_boost: number;
    bukijutsu_max_recovery: number;
    bloodline_exp: number;
    lightning_element: number;
    wind_element: number;
    tai_guard: number;
    nin_absorb: number;
    death: number;
    taijutsu_immunity: number;
}

export interface Genjutsu {
    name: string;
    capacity: number;
    cost: number;
    description: string;
    sub_genjutsu: Genjutsu[];
}