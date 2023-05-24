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
      const response = await fetch('https://stats.apy.vision/api/v1/pool_search/advanced_search?avg_period_daily_volume_usd=250000&avg_period_reserve_usd=1000000&min_pool_age_days=7&vr=0&exchanges=uniswap_eth&access_token=b55b52c3-3d81-47c5-8d47-91925ce6a6a9');

      const data = await response.json();
      const poolArray = data.results;
      const selectedPool = poolArray.find(pool => pool.name === selectPool);
      if (selectedPool) {
        const lpPrice = selectedPool.avg_lp_price;

        // Calculate LP token amount and portfolio value
        const initialInvestment = 100000; // $100,000
        const lpTokens = initialInvestment / lpPrice;
        const portfolioValue = lpTokens * lpPrice;

        // Make the PUT request to update user's fields on the backend
        const putResponse = await fetch('https://liquidity-fantasy-game.herokuapp.com/user', {
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
