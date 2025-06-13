import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { Item } from "../../models/Item";

export interface ItemsTableProps {
    items: Item[];
}

const ItemsTable = ({ items }: ItemsTableProps) => {
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1000 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Tai</TableCell>
                            <TableCell>Nin</TableCell>
                            <TableCell>Buki</TableCell>
                            <TableCell>Sta</TableCell>
                            <TableCell>Gen</TableCell>
                            <TableCell>Ele</TableCell>
                            <TableCell>Crit</TableCell>
                            <TableCell>Reroll</TableCell>
                            <TableCell>Atk</TableCell>
                            <TableCell>Bloodline Exp</TableCell>
                            <TableCell>Bukijutsu Boost</TableCell>
                            <TableCell>Bukijutsu Max Recovery</TableCell>
                            <TableCell>Bukijutsu Recovery</TableCell>
                            <TableCell>Critical Chance</TableCell>
                            <TableCell>Death</TableCell>
                            <TableCell>Earth Damage</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Fire Damage</TableCell>
                            <TableCell>Focus Burst</TableCell>
                            <TableCell>Genjutsu Absorb</TableCell>
                            <TableCell>Genjutsu Activation</TableCell>
                            <TableCell>Gold</TableCell>
                            <TableCell>Itemfind</TableCell>
                            <TableCell>Lightning Damage</TableCell>
                            <TableCell>Lightning Element</TableCell>
                            <TableCell>Nin Absorb</TableCell>
                            <TableCell>Poison</TableCell>
                            <TableCell>Taijutsu Immunity</TableCell>
                            <TableCell>Tai Guard</TableCell>
                            <TableCell>Water Damage</TableCell>
                            <TableCell>Wind Damage</TableCell>
                            <TableCell>Wind Element</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.stats.tai}</TableCell>
                                <TableCell>{item.stats.nin}</TableCell>
                                <TableCell>{item.stats.buki}</TableCell>
                                <TableCell>{item.stats.sta}</TableCell>
                                <TableCell>{item.stats.gen}</TableCell>
                                <TableCell>{item.stats.ele}</TableCell>
                                <TableCell>{item.stats.crit}</TableCell>
                                <TableCell>{item.stats.reroll}</TableCell>
                                <TableCell>{item.stats.atk}</TableCell>
                                <TableCell>{item.extra_stats.bloodline_exp}</TableCell>
                                <TableCell>{item.extra_stats.bukijutsu_boost}</TableCell>
                                <TableCell>{item.extra_stats.bukijutsu_max_recovery}</TableCell>
                                <TableCell>{item.extra_stats.bukijutsu_recovery}</TableCell>
                                <TableCell>{item.extra_stats.critical_chance}</TableCell>
                                <TableCell>{item.extra_stats.death}</TableCell>
                                <TableCell>{item.extra_stats.earth_damage}</TableCell>
                                <TableCell>{item.extra_stats.experience}</TableCell>
                                <TableCell>{item.extra_stats.fire_damage}</TableCell>
                                <TableCell>{item.extra_stats.focus_burst}</TableCell>
                                <TableCell>{item.extra_stats.genjutsu_absorb}</TableCell>
                                <TableCell>{item.extra_stats.genjutsu_activation}</TableCell>
                                <TableCell>{item.extra_stats.gold}</TableCell>
                                <TableCell>{item.extra_stats.itemfind}</TableCell>
                                <TableCell>{item.extra_stats.lightning_damage}</TableCell>
                                <TableCell>{item.extra_stats.lightning_element}</TableCell>
                                <TableCell>{item.extra_stats.nin_absorb}</TableCell>
                                <TableCell>{item.extra_stats.poison}</TableCell>
                                <TableCell>{item.extra_stats.taijutsu_immunity}</TableCell>
                                <TableCell>{item.extra_stats.tai_guard}</TableCell>
                                <TableCell>{item.extra_stats.water_damage}</TableCell>
                                <TableCell>{item.extra_stats.wind_damage}</TableCell>
                                <TableCell>{item.extra_stats.wind_element}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ItemsTable;