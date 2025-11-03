import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './ClientInformation.module.scss';

const ClientInformation = () => {
  const accountData = [
    {
      accountNo: '1234567890',
      openingDate: '21/01/25',
      riskRating: '6.2/10',
      closingDate: '-',
      status: 'Active',
      accountType: 'Type 1',
      currentBalance: '$65,000',
      interestRate: '2.5%',
    },
    {
      accountNo: '2345678901',
      openingDate: '22/10/24',
      riskRating: '8.1/10',
      closingDate: '-',
      status: 'Active',
      accountType: 'Type 3',
      currentBalance: '$81,000',
      interestRate: '2.8%',
    },
    {
      accountNo: '3456789012',
      openingDate: '14/08/24',
      riskRating: '7.3/10',
      closingDate: '-',
      status: 'Active',
      accountType: 'Type 4',
      currentBalance: '$95,500',
      interestRate: '3.1%',
    },
    {
      accountNo: '4567890123',
      openingDate: '02/05/23',
      riskRating: '8.5/10',
      closingDate: '12/08/25',
      status: 'Inactive',
      accountType: 'Type 2',
      currentBalance: '$1,000',
      interestRate: '1.0%',
    },
  ];

  return (
    <Box className={styles.clientInfoContainer}>
      <Typography variant="h6" className={styles.headerTitle}>
        Client Information
      </Typography>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table} aria-label="account details table">
          <TableHead className={styles.tableHead}>
            {/* Header with tooltip */}
            <TableRow className={styles.tableHeaderMain}>
              <TableCell colSpan={8} align="left" className={styles.tableHeaderTitle}>
                <Box className={styles.headerWithTooltip}>
                  Account Details
                  <Tooltip
                    title="This section provides an overview of account-level details including status, balance, and interest rate."
                    arrow
                    placement="right"
                  >
                    <IconButton size="small" className={styles.infoIcon}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <hr className={styles.headerDivider} />
              </TableCell>
            </TableRow>

            {/* Column headers */}
            <TableRow className={styles.tableHeaderRow}>
              {[
                'Account No.',
                'Opening Date',
                'Risk Rating',
                'Closing Date',
                'Status',
                'Account Type',
                'Current Balance',
                'Interest Rate',
              ].map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {accountData.map((row, index) => (
              <TableRow
                key={index}
                className={`${styles.tableRow} ${
                  index % 2 === 0 ? styles.evenRow : styles.oddRow
                }`}
              >
                <TableCell className={styles.tableCell}>{row.accountNo}</TableCell>
                <TableCell className={styles.tableCell}>{row.openingDate}</TableCell>
                <TableCell className={styles.tableCell}>{row.riskRating}</TableCell>
                <TableCell
                  className={`${styles.tableCell} ${
                    row.closingDate === '-' ? '' : styles.inactive
                  }`}
                >
                  {row.closingDate}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.statusWrapper}>
                    <Box
                      className={`${styles.statusDot} ${
                        row.status === 'Active' ? styles.active : styles.inactive
                      }`}
                    />
                    <Typography className={styles.tableCell}>{row.status}</Typography>
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell}>{row.accountType}</TableCell>
                <TableCell className={styles.tableCell}>{row.currentBalance}</TableCell>
                <TableCell className={styles.tableCell}>{row.interestRate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClientInformation;
