// import { GoogleLogin } from '@react-oauth/google';
// import { useNavigate } from 'react-router-dom'; 
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../redux/authSlice'; 
// function Login() {
//     const navigate = useNavigate(); 
//     const dispatch = useDispatch(); 

//     const onSuccess = (credentialResponse) => {
//         console.log("Login success! Credential: ", credentialResponse);
        
//         dispatch(loginSuccess({
//             token: credentialResponse.credential, 
//             user: credentialResponse.profileObj, 
//         }));

//         navigate('/video-recorder');
//     };

//     const onFailure = (res) => {
//         console.log("Login failed ", res);
//     };

//     return (
//         <div id="signInButton">
//             <GoogleLogin
//                 onSuccess={onSuccess}
//                 onError={onFailure}
//             />
//         </div>
//     );
// }

// export default Login;




import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log("OAuth Token: ", tokenResponse.access_token);
            
            dispatch(loginSuccess({
                token: tokenResponse.access_token, // This is the OAuth access token
            }));

            navigate('/video-recorder');
        },
        onError: (error) => {
            console.log("Login failed", error);
        },
        scope: 'https://www.googleapis.com/auth/drive.file' // Add scopes for Drive access
    });

    return (
        <div id="signInButton">
            <button onClick={() => login()}>
                Sign in with Google
            </button>
        </div>
    );
}

export default Login;
