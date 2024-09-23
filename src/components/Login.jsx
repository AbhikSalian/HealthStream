import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useDispatch } from 'react-redux'; // To dispatch actions
import { loginSuccess } from '../redux/authSlice'; // Import the loginSuccess action from your authSlice

function Login() {
    const navigate = useNavigate(); // Used to navigate after login success
    const dispatch = useDispatch(); // To update the auth state in Redux

    const onSuccess = (credentialResponse) => {
        console.log("Login success! Credential: ", credentialResponse);
        
        // Dispatch login success to update Redux state
        dispatch(loginSuccess({
            token: credentialResponse.credential, // Storing the Google OAuth token
            user: credentialResponse.profileObj, // Storing user info (modify as needed)
        }));

        // Navigate to VideoRecorder component after successful login
        navigate('/video-recorder');
    };

    const onFailure = (res) => {
        console.log("Login failed ", res);
    };

    return (
        <div id="signInButton">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onFailure}
            />
        </div>
    );
}

export default Login;
