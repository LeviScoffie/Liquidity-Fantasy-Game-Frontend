import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import Paper from '@mui/material/Paper';
import { Field, reduxForm } from 'redux-form';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import {
  SelectRedux,
} from 'enl-components/Forms/ReduxFormMUI';
import { initAction, clearAction } from 'enl-redux/actions/reduxFormActions';
require('dotenv').config();

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    value={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

const useStyles = makeStyles()((theme) => ({
  root: {
    flexGrow: 1,
    padding: 40
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'column'
  },
  buttonInit: {
    margin: theme.spacing(4),
    textAlign: 'center'
  },
}));
/** An object initialized, initial data */
const initData = {
  text: 'Sample Text',
  email: 'sample@mail.com',
  radio: 'option1',
  selection: '',
  onof: true,
  checkbox: true,
  textarea: 'This is default text'
};
/** A component being created */
function ReduxFormDemo(props) {
  const trueBool = true;
  const {
    classes
  } = useStyles();
  const {
    handleSubmit,
    submitting,

  } = props;

  const [pools, setPools] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsApyEndpoint = process.env.APY_STATS_ENDPOINT;
        const response = await fetch(statsApyEndpoint);
        const data = await response.json();
        const options = data.results.map(p => ({
          value: `${p.name} -  $${(p.avg_lp_price).toFixed(2)}`,
          label: `${p.name} -  $${(p.avg_lp_price).toFixed(2)}`,
          poolName: p.name
        }));

        setPools(options);
      } catch (error) {
        console.error('Error fetching liquidity pools:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Grid container spacing={3} alignItems="flex-start" direction="row" justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper className={classes.root}>
            <form onSubmit={() => handleSubmit()}>
              <div className={classes.fieldBasic}>
                <FormLabel component="label">Choose One Option</FormLabel>
                <Field name="radio" className={classes.inlineWrap} component={renderRadioGroup}>
                  <FormControlLabel value="Buy" control={<Radio />} label="Buy" />
                  <FormControlLabel value="Sell" control={<Radio />} label="Sell" />
                </Field>
              </div>
              <div>
                <FormControl variant="standard" className={classes.field}>
                  <InputLabel htmlFor="selection">Liquidity Pool - Price</InputLabel>
                  <Field
                    name="selection"
                    component={SelectRedux}
                    placeholder="Liquidity Pool"
                    autoWidth={trueBool}
                  >
                    {pools.map(p => (
                      <MenuItem key= {p.value} value={p.value}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </div>
              <div className={classes.fieldBasic}>
              </div>
              <div>
                <Button variant="contained" color="secondary" type="submit" disabled={submitting} onClick={() => handleSubmit()}>
                  Submit
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

renderRadioGroup.propTypes = { input: PropTypes.object.isRequired, };

ReduxFormDemo.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  // reset: PropTypes.func.isRequired,
  // pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  // init: PropTypes.func.isRequired,
  // clear: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch),
  clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
  form: 'reduxFormDemo',
  enableReinitialize: true,
})(ReduxFormDemo);

const FormInit = connect(
  state => ({
    initialValues: state.initval.formValues
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default FormInit;
