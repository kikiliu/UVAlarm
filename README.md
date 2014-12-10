UV Alarm
=======
##1. Problem statement

While right amount of sunlight exposure is essential for our health, overexposure can do harm such as severe sunburn and skin cancer. Since we cannot see the level of UV, putting on sunscreen at a right timing has been one of the easy-to-forget and hard-to-do in daily life. Sometimes we stay indoor all day and have no need to put on the oily armors; but other times we happen to be outside and fail to apply sufficient before the sunlight starts to burn our skin. Even those who put sunscreen-mixed make-ups every morning can fail to apply it again before the protection expired. For people working under the exposure of UV, the health risk can be more serious. How can we inform people the UV risk in their environment and support them to take necessary actions real-time? Our UV alarm is the solution for this problem.

##2. Solution
###2.1 Product brief
* Target User:
  * People who stay outside long time and tend to have overexposure of sunlight. 
  * People, especially young women, who want to avoid sunburn.
  * People who are sensitive to sunlight due to their skin type or health conditions.

* Use Case:

With our mobile application, a user can set up threshold of accumulated dose based on their preference and skin type. She gets feedback on Samsung Gear S when accumulated dose reached the level. If the user wants to dismiss the alert, she can simply tap on the wearable and turn it off. In the mean time, the device keeps logging accumulated UV data. If the user later would like to check the accumulated exposure at that time, she can launch the program and see it on the wearable display. 

* Main Feature:
  * Detect and display current UV level.
  * Calculate accumulative UV level and show how much time is left before users get sunburn.
  * Provide automatic notifications when users’ sunscreen expires and when users start to have sunburn.
  * Take users’ input about sunscreen application and its timing.
* Design:

We didn’t include mobile application for project 1

Device | Samsung Gear S
------ | --------------
Sensors | UV sensor in Samsung Gear S
Input Data from sensor | UV index data (0-15)
Other data | User’s skin type data, sunscreen application data
Output | Providing users information and alert about their sunburn risk through Samsung Gear S application.

###2.2 Key user insights (interview results) 
We recruited two potential users (a man and a woman who do outdoor activities on weekends) and conduct an initial interview. We identified the following user insights;

* People are generally aware of UV risk.

Both interviewees said they usually try to use sunscreen when they know they are or will be exposed to strong sunlight (e.g. outdoor activities, going to beach). On weekdays, they apply face cream containing some SPF once in the morning.
* Informing UV risk real-time can help people avoid sunburn.

Both interviewees shared recent incidence where they had severe sunburn and said that a real-time reminder tool like our project can prevent such cases. They said it is useful to be informed of both current UV level and accumulative level. They said if they are aware of the risk realtime, they would take preventive measures such as going under shade or applying sunscreen.
* There are potential obstacles when people reapply sunscreen.

An interviewee said that during outdoor activities on weekends, she usually reapplies sunscreen only once when she has midday break, assuming it should be OK. She feels she may need to do more often but she doesn't carry sunscreen or cannot remember it all the time. She also said she would not reapply sunscreen on weekdays because she doesn't want to spoil her make-up. Another interviewee doesn't carry sunscreen all the time, assuming reapplication is not necessary. While we decided not to cover this aspect within the scope of project 1, we learned that users should be reminded of taking sunscreen with them in the morning, too.
* Applying sunscreen is a habitual behavior.

Both interviewees pointed out that their behavioral tendencies in applying sunscreen (when and how they apply sunscreen) is pretty habitual and influenced by how their parents instructed them when they were small. A male interviewee said he recently started to apply sunscreen more often thanks to his wife, who is more careful about sunburn. To alter their existing mindset and behavior that lead sunburn, they need to receive intuitive and actionable messages real-time. 

* Applying sunscreen is a social behavior.

Both interviewees said that they are likely to put sunscreen if people around them are doing so. They feel reminded of UV risk by looking at other people applying sunscreen. A interviewee said that she often borrows sunscreen from friends at the time they are using it. Informing a user of UV risk may be able to positively impact other people around his/her. 

###2.3 Algorithms (Data we will use: UV level, Skin Type, SPF)

The app centers on a function that can calculate the time before a user getting sunburn. To achieve this function, we designed an algorithm that takes three inputs: UV level, User’s skin type, and SPF coefficient of sunscreen user applied.

* UV level

We first studied UV measurement. There is an international standard measurement system of UV strength, called UV index. The UV sensor in Samsung Gear S returns numeric value from 0-15 corresponding to UV index. The Index is equal to the EAS-weighted irradiance (in watts/m²) x 40. An Index of 10 is equivalent to an EAS-weighted irradiance of 0.25 W/m².
![UV Level](http://www.sandpointweather.com/ajax-images/UVI_maplegend_H.gif)

* Skin Type

The next thing we learned is that different skin types react differently to UV. system called Fitzpatrick Scale. Within each skin type a range of sensitivities will be found; some people will experience sunburn more quickly than others of the same phototype. 
![Skin Type](http://desertsuntanning.com/images/DST-SkinTypeChart.png)

*SPF coefficient

A handy chart provided here displayed how sunscreen can extend sunburn time. For example: an SPF 30 sunscreen would protect for up to 5 hours of sun exposure before sunburn occurs.
  
![SPF](http://media-cache-ec0.pinimg.com/236x/fc/dc/f5/fcdcf59b60d54e8fb23abb0fd60a4b68.jpg)

**Sunburn Threshold** 
MED is the Minimal Erythemal Dose and is defined as the threshold dose that may produce sunburn. It is the amount of EAS-weighted energy which causes barely perceptible redness to appear within 24 hours in previously unexposed skin. The base MED is equal to 21 mJ/cm² of EAS-weighted UV energy.

**Algorithm design**
Understanding relations among uv level, skin type and sunscreen, we developed an algorithm to calculate time before sunburn. We first calculate the skin resistant time, which is daily limit of each skin type minus accumulative UV dose devided by sensored UV level factored by skin type. Then in addition to it, we have sunscreen protection time, which is SPF times base time. If sunscreen protection time is positive, there’s no accumulative UV dose. When sunscreen expires, skin resistant time starts to decrease. When both become zero, your skin starts to burn.


>Rule 1: Time before sunburn =  skin resistant time + sunscreen protection time

>Rule 2: Skin resistant time (SRT) = (Daily MED - accumulative UV dose) / (Sensored UV level * skin type factor)

>Rule 3: Sunscreen protection time (SPT) = SPF * base time 

>Rule 4: When SPT >= 0, SRT is pause due to sunscreen protection.

##3 Project Outcome

###3.1 Expected outcome
Our expected outcome of project 1 was delivering a Gear S application that functions in emulator and receiving positive feedback on the application for its impact and interaction. More specifically, we aimed to let our potential users test the application in emulator and to hear that the application would help them to be more aware of sunburn risk and prevent unintended sunburn. 

###3.2 Interaction design 

Based on our main features, key user insights and altorithm, we developed interaction flow as in the github. Using them as a guide, we developed Samsung Gear S application. Our latest version of the Gear S application includes further improvement on UIs while interaction flow primarily stay the same.

###3.3 Actual Product

Since Samsung Gear S is not in the market yet, we use Samsung official emulator to develop the app. Here is our demo video for the app running on the emulator.

https://www.dropbox.com/s/pkufyz8k35nd4lw/Project1_App%20Demo.mov?dl=0

###4 Evaluation results

###4.1 Interview Three Potential Users

*Interviewees were able to find and understand current UV level.
All the interviewees were able to understand the detecting process and wait for the next process without confusion. Then, they were able to understand how the current UV level was. As they never used a similar application, information and interaction model appeared new to them. However, they were able to proceed with icon buttons and figured out what main features are.

*The meaning of time displayed on “Check your risk” page was not always clearly understood.
An interviewee struggled to understand the meaning of time displayed on “Check your risk” page. She said, “Hmmm, is it about time with sunscreen? How long I am wearing sunscreen?” We thought this was an important point and modified the UI by adding “before sunburn” so that users can understand what the counted time is about. Another interviewee mentioned he didn’t like the sand clock image because he associated the image to waiting or processing. We will further examine what a better visualization and metaphor could be. 

*Automatic notifications would be useful especially when users are not carrying or paying attention to mobile phones.
Two interviewees mentioned that notifications from our application works well on watch instead of mobile phone because people may not carry mobile phones during outdoor activities. They thought that a wearable device serves well for our real-time alert system.

*People are interested in learning the degree of  their sunburn after total protection time expires.
A interviewee told that he may want to know how bad sunburn he is getting after the time has expired. He said, “I don’t carry sunscreen all the time but if I am getting bad sunburn, I will go under the shade.” We believe providing this information is important because users may make different choices and behave differently with such information. We need to further study relations among skin type, UV level, time and degree of sunburn 

###4.2 Presentation Feedback

We received numerous positive feedback on our project for its concept, design process, benefit, algorithm, and UI. The following is a part of them;

>“Problem space is well defined”
>“Awesome application for smart watch, better than if using mobile phone”
>“Good use case for a wearable”, “Think watch is the perfect UI for detecting the UV”
>“User interviews”
>“Skin type as input is awesome idea”
>“UI is very clean and intuitive.”

With respect to what could be improved, people mentioned design of data input interaction, testing with real data from a device, and providing more instructions and encouraging messages for users.

>“A lot of clicking on SPF and time, improve UI?” 
>“Wheel” lists for SPF number & Application time.”
>“Too bad emulated.”
>“Need to actually get the device to test the sensor.”
>“Instructions about how to effectively apply sunscreen. Some people are more thorough than others.”

Questions were mostly about what could happen in particular use scenarios, and how we calculated sunscreen protection time and total protection time as we didn’t have time to describe in details during presentation. 

>“How do you deal with swimming in water? water will affect the effectiveness of sunscreen when people swim.”, “Is this waterproof?”
>“Does ‘expired’ refer to the date on the sunscreen, or does it mean what you put on earlier is now no use?”, “Accuracy of predicted UV? How reliable is it?”

Finally, class provided many insightful ideas through both Q and A discussion and feedback sheets. There are couple of people who mentioned using GPS and open weather data so that users without wearable devices can use the application. We still believe that our application works best with UV sensor data, providing users more accuracy and reliability, However, we definitely see the value of taking these information into consideration. As we discussed in our presentation, they help us estimate accumulative UV level when sensor data is not available. Some people mentioned that information about users’ physical conditions can make the app more context aware. In addition to it, there are ideas on visualization and analysis of aggregated UV data. 

>“Why not just use phone location to estimate UV?”
>“Can use GPS/Predicted index?”
>“Taking GPS and activity data into consideration (what could be the right way to intervene when running, when walking etc. Is it a beach or a garden or a work place etc..)”
>“Includes clothing, time of day so users can see when UV is bad etc into algorithm.”
>“Long term history to share with dermatologist”
>“No just sunburn, but aggregated UV are damaging-could be extra feature”

##5 Future Work

###5.1 Accuracy Improvement 1: Indoor/Outdoor classification 
	
As describe above, our algorithm relies heavily on accurate UV sensory data. In many cases the UV sensor will not be able to return accurate data, such as the angle to sunlight, user standing under shade, or user are entering a building. If users are still outdoor, we should recover the UV level based on weather forecast data or using cosine function to recover the accurate level. If users are indoor, maybe we will not recover the UV level and use the UV sensor data directly instead. 

So the action to determine user’s indoor/ outdoor status is crucial to improve accuracy. One way to do that is using machine learning techniques. We will collect a series of  sensor data and manually tagged them with indoor / outdoor status. Then we can use the training set to build up a classifier that given a series of UV level data to determine that this data is generated indoor or outdoor.  

###5.2Accuracy Improvement 2: Weather forecast data

As described above, when UV sensor can not work well to sense the UV level, we can use external UV data based on GPS location instead. One strength of Samsung Gear S is its self-independent network service. It didn’t need to rely on mobile phone to connect to internet. So its perfectly suitable for activities such as surfing or diving while users don’t carry the mobile phone with them.

###5.3 Usability Improvement 1: Wheel input of SPF and Time

With the small screen on wrist, every input from users will be painful if too much options are presented at once. One way to improve the UI is to use wheel instead of touch buttons. In the future we will investigate the method to make every input of SPF and Time more easier for users - probably by wheel.  

###5.4 New features
We would like to add several new features according to the feedback from our kind classmates. We also plan to implement a native mobile app in addition to the standalone watch app. In that way, a lot of complex interaction or setting could be moved to the mobile app as the current watch app is limited by touch area and display screen.
Track the user's daily UV consumption and visualize all her/his historical data on mobile device.
Help the users decide their skin type by step by step Fitzpatrick skin type test (Fitzpatrick Scale) on mobile device.
UV knowledge guide to help the users understand the UV index and related information.
UV index forecast, similar like weather forecast to help the user make protection decision before stepping out of the door.

##6 Reference

Thomas Fahrni , Michael Kuhn , Philipp Sommer , Roger Wattenhofer , Samuel Welten, Sundroid: solar radiation awareness with smartphones, Proceedings of the 13th international conference on Ubiquitous computing, September 17-21, 2011, Beijing, China [doi>10.1145/2030112.2030162]

"Understanding MED and MMD." Understanding MED and MMD. Informa Exhibitions, LLC, n.d. Web. 01 Nov. 2014.

"INTERPRETING UV READINGS" Sealing Technology 1995.18 (1995): 7. Davis Instruments. Web. <http://www.davisnet.com/product_documents/weather/app_notes/93004_306-AN_06-interpret-uv-readings.pdf>.
