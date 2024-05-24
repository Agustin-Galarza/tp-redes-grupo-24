import {
	CognitoIdentityProviderClient,
	AdminCreateUserCommand,
	AdminGetUserCommand,
	InitiateAuthCommand,
	RespondToAuthChallengeCommand,
	AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
const client = new CognitoIdentityProviderClient({});

const userPoolId = 'us-east-1_ooQCJ4gBj';
const clientId = '72kmbha36t535mrdp06kr7cotd';

const username = 'agustingalarza001@gmail.com';
const password = '_123abcABC_';

const main = async () => {
	const initAuthResponse = await client.send(
		new AdminInitiateAuthCommand({
			AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
			AuthParameters: {
				USERNAME: username,
				PASSWORD: password,
			},
			ClientId: clientId,
			UserPoolId: userPoolId,
		})
	);

	if (initAuthResponse.$metadata.httpStatusCode !== 200) {
		console.error('Error initiating auth:', initAuthResponse);
		return;
	}

	console.log(initAuthResponse);
};

main();
