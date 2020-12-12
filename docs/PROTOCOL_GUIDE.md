## Protocols

Feel as a part of electron application can use custom protocols.
In the other words You are able to open Feel desktop application using our custom protocol `feel`.

:exclamation: Please keep in mind that not all browsers has handling custom protocols handled as default.

#### Basic usage
After installing Feel on your device you will be able to use `feel` protocol.
Example: `feel://wallet`
![Alt text](./assets/feel_wallet.png?raw=true "Feel protocol basic")
Everything that comes after `feel://` is treated as a route so this example will open Feel app on wallet page.

#### Voting protocol
Makes voting for delegates easier 
`feel://main/voting/vote?votes=thepool,4miners.net` or `feel://delegates/vote?votes=thepool,4miners.net`
It will open feel app and select delegates automatically `thepool` and `4miners.net`

:exclamation: Please keep in mind that We don't use `/main` route anymore but some websites still relay on an old url so We are allowing `/main` in this particular case `main/voting/vote`.

![Alt text](./assets/voting_protocol.png?raw=true "Feel voting protocol")

#### Network switcher protocol
Opens the login page and enables the network switcher options.

`feel://add-account?showNetwork=true`

![Alt text](./assets/network_switcher.png?raw=true "Feel voting protocol")

#### Send protocol
Opens the wallet and prefills the send form with recipient and amount.

`feel://wallet?recipient=16313739661670634666L&amount=5`

![Alt text](./assets/send.png?raw=true "Feel voting protocol")

#### Sign message protocol
Opens the sign message form and prefills it with your message.

`feel://sign-message?message=my message`

![Alt text](./assets/sign_message.png?raw=true "Feel voting protocol")

