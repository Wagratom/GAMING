
export function AuthLogin(event: any) {

	//MAKE THE BUTTON DO NOT UDATE THE PAGE
	event.preventDefault();

	const authURL: string | undefined = process.env.REACT_APP_AUTHCODE_URL;
	if (authURL != null) {
		window.location.href = authURL;
	} else {
		//throw exception
	}
}
