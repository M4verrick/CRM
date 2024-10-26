import {CognitoUserPool} from "amazon-cognito-identity-js"

const poolData = {
    UserPoolId: "ap-southeast-1_ya55bZ0sg",
    ClientId: "46d0ev383r0i600e39nh43k9ac"
}

export default new CognitoUserPool(poolData)