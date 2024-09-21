import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // For navigation

function Login() {
    const navigate = useNavigate(); // Used to navigate after login success

    const onSuccess = (credentialResponse) => {
        console.log("Login success! Credential: ", credentialResponse);
        // You can add further processing here, such as storing the token
        navigate('/video-recorder'); // Navigate to VideoRecorder component after successful login
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