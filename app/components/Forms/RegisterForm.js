import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Icon from '@mui/material/Icon';
import CircularProgress from '@mui/material/CircularProgress';
import { injectIntl, FormattedMessage } from 'react-intl';
import { closeMsgAction } from 'enl-redux/actions/authActions';
import { CheckboxRedux, TextFieldRedux } from './ReduxFormMUI';
import MessagesForm from './MessagesForm';
import messages from './messages';
import useStyles from './user-jss';

import Routes from '../../utils/routes';

// validation functions
const required = value => (value === null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

const passwordsMatch = (value, allValues) => {
  if (value !== allValues.password) {
    return 'Passwords dont match';
  }
  return undefined;
};

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

function RegisterForm(props) {
  const { classes, cx } = useStyles();
  const {
    handleSubmit,
    pristine,
    submitting,
    intl,
    messagesAuth,
    closeMsg,
    loading
  } = props;

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const onSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Registration Succesful');

        setRedirectToLogin(true);
      } else {
        const data = await response.json();

        console.log('Registration failed', data.error);
      }
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  if (redirectToLogin) {
    return <Redirect to={Routes.login}/>;
  }

  return (
    <Paper className={classes.sideWrap}>
      <Hidden mdUp>
        <div className={classes.headLogo}>
          <NavLink to="/" className={classes.brand}>
            <img src={logo} alt={brand.name} />
            {brand.name}
          </NavLink>
        </div>
      </Hidden>
      <div className={classes.topBar}>
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage {...messages.register} />
        </Typography>
        <Button size="small" className={classes.buttonLink} component={LinkBtn} to="/login">
          <Icon className={cx(classes.icon, classes.signArrow)}>arrow_forward</Icon>
          <FormattedMessage {...messages.toAccount} />
        </Button>
      </div>
      {
        messagesAuth !== null || ''
          ? (
            <MessagesForm
              variant="error"
              className={classes.msgUser}
              message={messagesAuth}
              onClose={closeMsg}
            />
          )
          : ''
      }
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <Field
                name="email"
                component={TextFieldRedux}
                placeholder={intl.formatMessage(messages.loginFieldEmail)}
                label={intl.formatMessage(messages.loginFieldEmail)}
                required
                validate={[required, email]}
                className={classes.field}
              />
            </FormControl>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl variant="standard" className={classes.formControl}>
                <Field
                  name="password"
                  component={TextFieldRedux}
                  type="password"
                  label={intl.formatMessage(messages.loginFieldPassword)}
                  required
                  validate={[required, passwordsMatch]}
                  className={classes.field}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="standard" className={classes.formControl}>
                <Field
                  name="passwordConfirm"
                  component={TextFieldRedux}
                  type="password"
                  label={intl.formatMessage(messages.loginFieldRetypePassword)}
                  required
                  validate={[required, passwordsMatch]}
                  className={classes.field}
                />
              </FormControl>
            </Grid>
          </Grid>
          <div className={classes.btnArea}>
            <Button variant="contained" fullWidth disabled={loading} color="primary" type="submit">
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              <FormattedMessage {...messages.loginButtonContinue} />
              {!loading && <ArrowForward className={cx(classes.rightIcon, classes.iconSmall, classes.signArrow)} disabled={submitting || pristine} />}
            </Button>
          </div>
        </form>
      </section>
    </Paper>
  );
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  messagesAuth: PropTypes.string,
  closeMsg: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

RegisterForm.defaultProps = {
  messagesAuth: null
};

const RegisterFormReduxed = reduxForm({
  form: 'registerForm',
  enableReinitialize: true,
})(RegisterForm);

const mapDispatchToProps = {
  closeMsg: closeMsgAction
};

const mapStateToProps = state => ({
  messagesAuth: state.authReducer.message,
  loading: state.authReducer.loading
});

const RegisterFormMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterFormReduxed);

export default injectIntl(RegisterFormMapped);
