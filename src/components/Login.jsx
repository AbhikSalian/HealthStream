import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice'; 
function Login() {
    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 

    const onSuccess = (credentialResponse) => {
        console.log("Login success! Credential: ", credentialResponse);
        
        dispatch(loginSuccess({
            token: credentialResponse.credential, 
            user: credentialResponse.profileObj, 
        }));

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
