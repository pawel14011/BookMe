// cognito/userPool.js
import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
	UserPoolId: 'eu-central-1_m3RArqZ8e', // Twój User Pool ID
	ClientId: '60j126jo2eb1od3flljrvnbe28', // Twój App Client ID
}

const userPool = new CognitoUserPool(poolData)

export default userPool
