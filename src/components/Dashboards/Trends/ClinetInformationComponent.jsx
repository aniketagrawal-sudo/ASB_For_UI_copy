import React from 'react';
import {
    Box,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import Grid2 from "@mui/material/Grid2";
import classes from './ClinetInformation.module.scss';
import PropTypes from 'prop-types';

export default function ClinetInformationComponent({filteredAccountDetails}) {
    const accountData = filteredAccountDetails['accounts'];
    const engagementData = filteredAccountDetails['engagement'];
    const teamData = filteredAccountDetails['teams'];

    const tableHeaders = [
        'Account No.',
        'Opening Date',
        'Risk Rating',
        'Closing Date',
        'Status',
        'Account Type',
        'Current Balance',
        'Interest Rate',
    ];

    const renderStatus = (status) => (
        <div className={classes.statusIndicator}>
            <span className={`${classes.statusDot} ${status === 'Active' ? classes.active : classes.inactive}`} />
            <span>{status}</span>
        </div>
    );

    return (
        <Box className={classes.container}>
            {/* Account Details */}
            <div
                role="region"
                aria-labelledby="account-details"
                className={classes.sectionCard}
                style={{ marginBottom: '24px' }}>
                <div id="account-details" className={classes.sectionHeader}>
                    Account Details
                    <Tooltip
                        title="This section provides an overview of account-level details including status, balance, and interest rate."
                        arrow
                        placement="right">
                        <IconButton size="small" className={classes.infoIcon}>
                            <InfoOutlinedIcon sx={{ fontSize: '11px' }} />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.sectionBodyNoPad}>
                    <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderRadius: 0 }}>
                        <Table size="small" aria-label="account details table"
                            className={classes.accountTable}
                        >
                            <TableHead>
                                <TableRow
                                    sx={{
                                        '& th': {
                                            fontWeight: 600,
                                            backgroundColor: '#F1F7F4',
                                        },
                                    }}>
                                    {tableHeaders.map((h) => (
                                        <TableCell key={h}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {accountData.map((row, idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{
                                            backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F4F4F4', // <-- zebra rows
                                            '&:last-child td, &:last-child th': { border: 0 },
                                        }}>
                                        <TableCell>{row.no}</TableCell>
                                        <TableCell>{row.openingDate}</TableCell>
                                        <TableCell>{row.riskRating}</TableCell>
                                        <TableCell>{row.closingDate}</TableCell>
                                        <TableCell>{renderStatus(row.status)}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.balance}</TableCell>
                                        <TableCell>{row.interestRate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            {/* Bottom sections */}
            <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.stretch}>
                    <section className={classes.sectionCard}>
                        <header className={classes.sectionHeader}>
                            Engagement Dates
                            <Tooltip
                                title="This section provides an overview of account-level details including status, balance, and interest rate."
                                arrow
                                placement="right">
                                <IconButton size="small" className={classes.infoIcon}>
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </header>
                        <div className={classes.sectionBody}>
                            {engagementData.map((item) => (
                                <div key={item.label} className={classes.engagementRow}>
                                    <span className={classes.engagementLabel}>{item.label}&nbsp; - </span>
                                    <span className={classes.engagementDate}>
                                        {item.date}
                                        {item.status !== 'none' && (
                                            <span
                                                className={`${classes.dateDot} ${item.status === 'green' ? classes.dotGreen : classes.dotOrange
                                                    }`}
                                            />
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.stretch}>
                    <section className={classes.sectionCard}>
                        <header className={classes.sectionHeader}>
                            Other ASB Teams Connected
                            <Tooltip
                                title="This section provides an overview of account-level details including status, balance, and interest rate."
                                arrow
                                placement="right">
                                <IconButton size="small" className={classes.infoIcon}>
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </header>
                        <div className={classes.sectionBody}>
                            {teamData.map((t, i) => (
                                <div key={`${t.team}-${i}`} className={classes.teamBlock}>
                                    <div className={classes.teamName}>{t.team}</div>
                                    <div className={classes.teamContactInfo}>
                                        {t.contactName} — {t.email}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </Grid>
            </Grid>
        </Box>
    );
}

ClinetInformationComponent.propTypes = {
   filteredAccountDetails: PropTypes.object.isRequired
};
