import { GoogleLogout } from "@react-oauth/google";
function Logout(){
    const onSuccess = (res) => {
        console.log("Login success! Current user: ",res.profileObj);
    }
    const onFailure = (res) => {
        console.log("Login failed ",res);
    }
    return(
        <div id="signOutButton">
            <GoogleLogout
            clientId={clientId}
            buttonText={"Logout"}
            onLogoutSuccess={onSuccess}
            
            />
        </div>
    )
}
export default Logout;