import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from 'tss-react/mui';
import brand from 'enl-api/dummy/brand';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { SourceReader, PapperBlock, EmptyData } from 'enl-components';
import { injectIntl } from 'react-intl';
import messages from './messages';
import StrippedTable from './StrippedTable';

const useStyles = makeStyles()(() => ({
  root: {
    flexGrow: 1,
  }
}));

function BasicTable(props) {
  const { intl } = props;

  const { classes } = useStyles();

  const title = brand.name + ' - Table';
  const description = brand.desc;
  const docSrc = 'containers/Tables/';

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <div>
        <StrippedTable />
        <SourceReader componentName={docSrc + 'StrippedTable.js'} />
      </div>
    </div>
  );
}

BasicTable.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(BasicTable);
