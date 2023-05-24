import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import Hidden from '@mui/material/Hidden';
import { Field, reduxForm } from 'redux-form';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Paper from '@mui/material/Paper';
import Icon from '@mui/material/Icon';
import CircularProgress from '@mui/material/CircularProgress';
import brand from 'enl-api/dummy/brand';
import logo from 'enl-images/logo.svg';
import { injectIntl, FormattedMessage } from 'react-intl';
import { closeMsgAction } from 'enl-redux/actions/authActions';
import { CheckboxRedux, TextFieldRedux } from './ReduxFormMUI';
import MessagesForm from './MessagesForm';
import messages from './messages';
import useStyles from './user-jss';
import { AuthContext } from '../../AuthContext';

// validation functions
const required = value => (value === null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

function LoginForm(props) {
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

  const { setAccessToken } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = event => event.preventDefault();

  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLoginSubmit = async (values) => {
    try {
      // Send a POST request to the API endpoint
      const response = await fetch('https://liquidity-fantasy-game.herokuapp.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();

        // Extract the access token from the response
        const accessToken = data.access_token;
        setAccessToken(accessToken);
        // // Store the access token in localStorage
        // localStorage.setItem('accessToken', accessToken);

        // Login successful, set the loginSuccess state to true

        alert('Login Successful');
        setLoginSuccess(true);
      } else {
        // Login failed, handle the error
        alert('Incorrect Password or Email');
        const data = await response.json();
        console.log('Login Error:', data.error);
        // You can display an error message to the user here if needed
      }
    } catch (error) {
      console.log('Login Error:', error);
      // Handle network or other errors here
    }
  };

  if (loginSuccess) {
    // Redirect to the dashboard page
    return <Redirect to="/app/pages/table" />;
  }

  return (
    <Paper className={classes.sideWrap}>
      <Hidden mdUp>
        <div className={classes.headLogo}>
          <NavLink to="/login" className={classes.brand}>
            <img src={logo} alt={brand.name} />
            {brand.name}
          </NavLink>
        </div>
      </Hidden>
      <div className={classes.topBar}>
        <Typography variant="h4" className={classes.title}>
          <FormattedMessage {...messages.login} />
        </Typography>
        <Button size="small" className={classes.buttonLink} component={LinkBtn} to="/register">
          <Icon className={cx(classes.icon, classes.signArrow)}>arrow_forward</Icon>
          <FormattedMessage {...messages.createNewAccount} />
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
      <section className={classes.pageFormSideWrap}>
        <form onSubmit={handleSubmit(handleLoginSubmit)}>
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
          <div>
            <FormControl variant="standard" className={classes.formControl}>
              <Field
                name="password"
                component={TextFieldRedux}
                type={showPassword ? 'text' : 'password'}
                label={intl.formatMessage(messages.loginFieldPassword)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        size="large">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                required
                validate={required}
                className={classes.field}
              />
            </FormControl>
          </div>
          <div className={classes.optArea}>
            <FormControlLabel
              className={classes.label}
              control={<Field name="checkbox" component={CheckboxRedux} />}
              label={intl.formatMessage(messages.loginRemember)}
            />
            <Button size="small" component={LinkBtn} to="/reset-password" className={classes.buttonLink}>
              <FormattedMessage {...messages.loginForgotPassword} />
            </Button>
          </div>
          <div className={classes.btnArea}>
            <Button variant="contained" disabled={loading} fullWidth color="primary" size="large" type="submit">
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              <FormattedMessage {...messages.loginButtonContinue} />
              {!loading && <ArrowForward className={cx(classes.rightIcon, classes.iconSmall, classes.signArrow)} disabled={submitting || pristine} />}
            </Button>
          </div>
        </form>
      </section>
      <h5 className={classes.divider}>
        <span>
          <FormattedMessage {...messages.loginOr} />
        </span>
      </h5>
      <section className={classes.socmedSideLogin}>
        <Button
          variant="contained"
          className={classes.redBtn}
          type="button"
          size="large"
        >
          <i className="ion-logo-google" />
          Google
        </Button>
        <Button
          variant="contained"
          className={classes.cyanBtn}
          type="button"
          size="large"
        >
          <i className="ion-logo-twitter" />
          Twitter
        </Button>
        <Button
          variant="contained"
          className={classes.greyBtn}
          type="button"
          size="large"
        >
          <i className="ion-logo-github" />
          Github
        </Button>
      </section>
    </Paper>
  );
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  messagesAuth: PropTypes.string,
  loading: PropTypes.bool,
  closeMsg: PropTypes.func.isRequired,
};

LoginForm.defaultProps = {
  messagesAuth: null,
  loading: false
};

const LoginFormReduxed = reduxForm({
  form: 'loginForm',
  enableReinitialize: true,
})(LoginForm);

const mapDispatchToProps = {
  closeMsg: closeMsgAction
};

const mapStateToProps = state => ({
  messagesAuth: state.authReducer.message,
  loading: state.authReducer.loading
});

const LoginFormMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormReduxed);

export default injectIntl(LoginFormMapped);
