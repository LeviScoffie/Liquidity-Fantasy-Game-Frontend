import React, {
  Fragment, useEffect, useState, useContext
} from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useStyles from 'enl-components/Tables/tableStyle-jss';
import { AuthContext } from '../../../AuthContext';

function StrippedTable({ userId }) {
  const { accessToken } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('https://liquidity-fantasy-game.herokuapp.com/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setProfileData(data);
        } else {
          console.error('Error fetching user data:', res.statusText);
        }
      } catch (error) {
        console.log('Error Found In:', error);
      }
    };
    fetchUserData();
  }, [accessToken]);

  const { classes, cx } = useStyles();
  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <div className={classes.title}>
          <Typography className={classes.title} variant="h6">User Portfolio</Typography>
        </div>
      </Toolbar>
      <div className={classes.rootTable}>
        <Table className={cx(classes.table, classes.stripped)}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="right">Portfolio Value ($)</TableCell>
              <TableCell align="right">Liquidity Pool</TableCell>
              <TableCell align="right">LP Token Amount</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>

            <TableRow>
              <TableCell>{profileData.email}</TableCell>
              <TableCell align="right">{`$ ${profileData.portfolioValue}`}</TableCell>
              <TableCell align="right">{profileData.liquidityPool}</TableCell>
              <TableCell align="right">{profileData.lpTokens}</TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}

export default StrippedTable;
