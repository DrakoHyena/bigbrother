# Big Brother
### Always watching, always listening.

## Intended Use
| Yes      | No              |
|----------|-----------------|
| Im nuerotic about my privacy | Im SUPER nuerotic about my privacy |
| I dont want companies keeping a direct record of me | I dont care what companies do with my data |
| I want an interactive assistant with camera, microphone, and video capabilities | I want a simple voice assistant |
| I have a device, camera, microphone, and display to spare | I use all my devices consistantly | 
| I only want answers and details directly related to queries | I want service integrations (music providers, calander, amazon) and full conversations with my assistant |
| I want to host this for myself | I want to host this for untrusted people |

## Quickstart
1. Download the NodeJS
2. Download the project
3. Add your keys to /public/apiKeys.js (NOTE: these are served to the client, meaning anyone can access these keys.
Therefore access should be restricted to those you trust.)
## Rationale/Background
The inception of this project lies in the introduction of old
home assistants in my living space, specially Amazon Echos.
As obvious as it is, although it's not given much thought by most,
these devices are essentially bugged microphones inside of your own home.
However, it is worth noting that the microphone really is only active
after the wake word ("Alexa") is said. But a few problems still present themselves.
The first is that all processing is done through Amazon's servers as of March, 2025[^1],
meaning all of your voice data, queries, habits, etc. are uploaded to the internet.
While there this is not necessarily an active threat, should amazon have a data leak,
train AIs off your data, or should a powerful entity have an interest in your data,
then that can quickly change.
The second issue is that, for some inexcusable reason, amazon limits these devices to 4
years of security updates[^2]. Unlike the first threat, this one is much more of a matter
of when. An unsuspecting microphone inside your own home that processes all of your queries
without issue for years suddenly ending security updates is the holy grail for malicious actors.
Not to mention, once it's cracked, they gain access to millions of homes. Even if there is hardware
muting and the microphone is only active after wake word activation, this still poses a massive and
undeniable threat to your privacy. It's also unlikely that this attack would only be used by a select few,
it can be assumed that it would be used by a great many. Most of these attackers would likely be trying to 
systematically trace users to real life events, virtual accounts, or to get passwords and other sensitve information
that would otherwise be difficult to obtain.

[^1]: https://www.cloudcomputing-news.net/news/amazon-to-end-local-voice-processing-on-echo-devices-but-do-people-care/
[^2]: https://www.amazon.com/gp/help/customer/display.html?nodeId=GMZQWNQRVENX4GTQ

## Okay... So I replace that Spy Device with this one?
Yup. Trust me with all your data.
Only joking. This program runs entirely within the browser **aside from queries** which must be handled by a data source.
Due to google's strict search API limits (and the fact that google OAuth is an absolute pain the ass), I opted to use AI instead.
The requests go through [OpenRouter](https://openrouter.ai/) and then to the selected AI provider. While there is still a 
potential breach of privacy, OpenRouter has shown to have good data protection (and has never had a data leak as of writting this,
as they claim to not store or log your data). However, the same could not be said with the AI providers themselves which more often than not,
goes unstated, though it can be assumed that the queries would be used for training purposes. This is a crutial factor which must be considered
when deciding to used this program. However, should you choose, you can rip out the OpenRouter code and replace it with a locally hosted solution.
In my case, I have no suitable devices which can run adequate models.
The second outlet of data are queries to Pixabay for images. They state that they do collect your data from queries which can prove to be a threat.
Unfortunately, image search APIs are *extremely* limited on free tiers and Pixabay has the most liberal limits leaving me with no other real option.
AI Image generation was considered, but aside from being extremely slow and inefficient, it wouldnt be real data which defeats the purpose.
Another thing to consider is that, while the only thing that leaves the device is text from speech to text following the keyword, its constantly recording
both audio and video. This issue is essentially nonexistant provided that the device you are running this on is up to date and secure. Ideally, the device
that this program is ran on would be used soley for Big Brother and has no history of accessing the internet.
NOTE: The browser speech recognition API is used for speech to text. As of writting this, Google Chrome has added the ability to process this locally (finally.. after years), however,
the same cannot be said for other browsers. Additionally, you must trust that Google Chrome will respect the processLocally flag.

## What's with the name?
As you probably suspect, the name Big Brother comes from George Orwell's famous book, 1984, which depicts a cruel, totalitarian, and omnipresent state for which
there is no escape from. Ironically, the best modern equivalents (aside from our governments...) are big tech corporations, like Amazon. I thought it would be 
funny to lean into this, primarily through tracking those that walk by and making them feel watched. While perhaps unsettling, this differs little from the 
current reality of these devices, only this program lets you stay relatively private.
