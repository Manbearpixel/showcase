# ODIN.Chat

## *Flagship mobile application providing secure conversations, anonymous identities, and an embedded cryptocurrency wallet.*

------

[ODIN.Chat](https://odin.chat) was developed for [ODIN Blockchain](https://odinblockchain.org) over the course of several months. It is built off of NativeScript and Angular7. NativeScript is a framework to develop native apps using JavaScript/TypeScript and supports both Angular and VueJS.

The current iteration available through the [Google Play Store](https://play.google.com/store/apps/details?id=org.odinblockchain.messenger) is currently closed source pending appropriate open source licensing and up to the foundation. That said, adequate permission has been granted to allow for small snippets of the source to be made available to showcase to the geater community and other interested parties.

This application relies on two NativeScript Plugins: [NativeScript Libsignal-Protocol](https://github.com/Manbearpixel/nativescript-libsignal-protocol) and [NativeScript ElectrumX-Client](https://github.com/Manbearpixel/nativescript-electrumx-client). Both of these plugins were written by me and allow for the ODIN.Chat application to interface with core native functionality and/or libraries made exclusively for a given phone language. For example, both of the plugins listed above utilize JAVA packages which would otherwise be dependenceis on a pure Android-based application. To make these packages work for ODIN.Chat and thus a JavaScript framework, they had to be presented in a consumable format.
