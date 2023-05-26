/* eslint-disable indent */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { SourceReader, PapperBlock } from 'enl-components';
import { injectIntl } from 'react-intl';
import messages from './messages';
import ReduxFormDemo from './ReduxFormDemo';
require('dotenv').config();

const useStyles = makeStyles()(() => ({
  root: {
    flexGrow: 1,
  }
}));

function ReduxForm(props) {
  const [valueForm, setValueForm] = useState();

  const showResult = (values) => {
    setTimeout(() => {
      setValueForm(values);
    }, 500); // simulate server latency
  };

  const title = brand.name + ' - Form';
  const description = brand.desc;
  const docSrc = 'containers/Forms/demos/';
  const { intl } = props;
  const { classes } = useStyles();

  const handleSubmit = async (selectPool) => {
    try {
     const statsApyEndpoint = process.env.APY_STATS_ENDPOINT;
      const response = await fetch(statsApyEndpoint);

      const data = await response.json();
      const poolArray = data.results;
      const selectedPool = poolArray.find(pool => pool.name === selectPool);
      if (selectedPool) {
        const lpPrice = selectedPool.avg_lp_price;

        const initialInvestment = 100000; // $100,000
        const lpTokens = initialInvestment / lpPrice;
        const portfolioValue = lpTokens * lpPrice;

        const userEndpoint = process.env.USER_ENDPOINT;
        const putResponse = await fetch(userEndpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portfolioValue,
            lpTokens,
            selectPool,
          }),
        });

            if (putResponse.ok) {
              // Handle successful submission
              console.log(putResponse);
            } else {
              // Handle error response
              console.error('Error:', putResponse.statusText);
            }
      } else {
      // Handle selected pool not found
      showResult();
      console.log(data);
        console.error('Selected liquidity pool not found in API response');
      }
    } catch (error) {
      console.log('Error could not update DB', error);
    }
  };
  return (
    <div className={classes.root}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
        <div>
          <ReduxFormDemo onSubmit={handleSubmit} />
          {valueForm && (
            <p>
              You purchased {}
              <br />
              { JSON.stringify(valueForm.selection) }
            </p>
          )}
          <SourceReader componentName={docSrc + 'ReduxFormDemo.js'} />
        </div>

    </div>
  );
}

ReduxForm.propTypes = { intl: PropTypes.object.isRequired, };

export default injectIntl(ReduxForm);
