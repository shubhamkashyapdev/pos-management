import React, { Fragment } from 'react';

// Material UI Components //
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// components //
const useStyles = makeStyles((theme) => ({}));

export const Landing = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Fragment>
      <h1 className={classes.heading}>Home!!</h1>
    </Fragment>
  );
};
export default Landing;
