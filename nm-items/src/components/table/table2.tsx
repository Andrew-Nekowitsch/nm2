import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { type TableItem } from '../../models/Item';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator(
    order: Order,
    orderBy: keyof TableItem,
): (
    a: TableItem,
    b: TableItem,
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof TableItem;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'tai',
        numeric: true,
        disablePadding: true,
        label: 'Tai',
    },
    {
        id: 'nin',
        numeric: true,
        disablePadding: true,
        label: 'Nin',
    },
    {
        id: 'buki',
        numeric: true,
        disablePadding: true,
        label: 'Buki',
    },
    {
        id: 'sta',
        numeric: true,
        disablePadding: true,
        label: 'Sta',
    },
    {
        id: 'gen',
        numeric: true,
        disablePadding: true,
        label: 'Gen',
    },
    {
        id: 'ele',
        numeric: true,
        disablePadding: true,
        label: 'Ele',
    },
    {
        id: 'crit',
        numeric: true,
        disablePadding: true,
        label: 'Crit',
    },
    {
        id: 'reroll',
        numeric: true,
        disablePadding: true,
        label: 'Reroll',
    },
    {
        id: 'atk',
        numeric: true,
        disablePadding: true,
        label: 'Atk',
    },
    {
        id: 'wind_damage',
        numeric: true,
        disablePadding: true,
        label: 'Wind Damage',
    },
    {
        id: 'water_damage',
        numeric: true,
        disablePadding: true,
        label: 'Water Damage',
    },
    {
        id: 'fire_damage',
        numeric: true,
        disablePadding: true,
        label: 'Fire Damage',
    },
    {
        id: 'earth_damage',
        numeric: true,
        disablePadding: true,
        label: 'Earth Damage',
    },
    {
        id: 'lightning_damage',
        numeric: true,
        disablePadding: true,
        label: 'Lightning Damage',
    },
    {
        id: 'poison',
        numeric: true,
        disablePadding: true,
        label: 'Poison',
    },
    {
        id: 'critical_chance',
        numeric: true,
        disablePadding: true,
        label: 'Critical Chance',
    },
    {
        id: 'itemfind',
        numeric: true,
        disablePadding: true,
        label: 'TableItem Find',
    },
    {
        id: 'experience',
        numeric: true,
        disablePadding: true,
        label: 'Experience',
    },
    {
        id: 'gold',
        numeric: true,
        disablePadding: true,
        label: 'Gold',
    },
    {
        id: 'focus_burst',
        numeric: true,
        disablePadding: true,
        label: 'Focus Burst',
    },
    {
        id: 'genjutsu_absorb',
        numeric: true,
        disablePadding: true,
        label: 'Genjutsu Absorb',
    },
    {
        id: 'genjutsu_activation',
        numeric: true,
        disablePadding: true,
        label: 'Genjutsu Activation',
    },
    {
        id: 'bukijutsu_recovery',
        numeric: true,
        disablePadding: true,
        label: 'Bukijutsu Recovery',
    },
    {
        id: 'bukijutsu_boost',
        numeric: true,
        disablePadding: true,
        label: 'Bukijutsu Boost',
    },
    {
        id: 'bukijutsu_max_recovery',
        numeric: true,
        disablePadding: true,
        label: 'Bukijutsu Max Recovery',
    },
    {
        id: 'bloodline_exp',
        numeric: true,
        disablePadding: true,
        label: 'Bloodline Exp',
    },
    {
        id: 'lightning_element',
        numeric: true,
        disablePadding: true,
        label: 'Lightning Element',
    },
    {
        id: 'wind_element',
        numeric: true,
        disablePadding: true,
        label: 'Wind Element',
    },
    {
        id: 'tai_guard',
        numeric: true,
        disablePadding: true,
        label: 'Tai Guard',
    },
    {
        id: 'nin_absorb',
        numeric: true,
        disablePadding: true,
        label: 'Nin Absorb',
    },
    {
        id: 'death',
        numeric: true,
        disablePadding: true,
        label: 'Death',
    },
    {
        id: 'taijutsu_immunity',
        numeric: true,
        disablePadding: true,
        label: 'Taijutsu Immunity',
    },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TableItem) => void;
    order: Order;
    orderBy: keyof TableItem;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
        (property: keyof TableItem) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
function EnhancedTableToolbar() {
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
            ]}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Equipment
            </Typography>
            <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}


export interface ItemsTableProps {
    items: TableItem[];
}

export default function EnhancedTable({ items }: ItemsTableProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof TableItem>('name');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof TableItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...items]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows.map((item, _index) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={item.id}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.tai}</TableCell>
                                        <TableCell>{item.nin}</TableCell>
                                        <TableCell>{item.buki}</TableCell>
                                        <TableCell>{item.sta}</TableCell>
                                        <TableCell>{item.gen}</TableCell>
                                        <TableCell>{item.ele}</TableCell>
                                        <TableCell>{item.crit}</TableCell>
                                        <TableCell>{item.reroll}</TableCell>
                                        <TableCell>{item.atk}</TableCell>
                                        <TableCell>{item.wind_damage}</TableCell>
                                        <TableCell>{item.water_damage}</TableCell>
                                        <TableCell>{item.fire_damage}</TableCell>
                                        <TableCell>{item.earth_damage}</TableCell>
                                        <TableCell>{item.lightning_damage}</TableCell>
                                        <TableCell>{item.poison}</TableCell>
                                        <TableCell>{item.critical_chance}</TableCell>
                                        <TableCell>{item.itemfind}</TableCell>
                                        <TableCell>{item.experience}</TableCell>
                                        <TableCell>{item.gold}</TableCell>
                                        <TableCell>{item.focus_burst}</TableCell>
                                        <TableCell>{item.genjutsu_absorb}</TableCell>
                                        <TableCell>{item.genjutsu_activation}</TableCell>
                                        <TableCell>{item.bukijutsu_recovery}</TableCell>
                                        <TableCell>{item.bukijutsu_boost}</TableCell>
                                        <TableCell>{item.bukijutsu_max_recovery}</TableCell>
                                        <TableCell>{item.bloodline_exp}</TableCell>
                                        <TableCell>{item.lightning_element}</TableCell>
                                        <TableCell>{item.wind_element}</TableCell>
                                        <TableCell>{item.tai_guard}</TableCell>
                                        <TableCell>{item.nin_absorb}</TableCell>
                                        <TableCell>{item.death}</TableCell>
                                        <TableCell>{item.taijutsu_immunity}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (34.5) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={items.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}