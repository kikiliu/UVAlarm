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
* Data Input

The app centers on a function that can calculate the time before a user getting sunburn. To achieve this function, we designed an algorithm that takes three inputs: UV level, User’s skin type, and SPF coefficient of sunscreen user applied.

  * UV level

We first studied UV measurement. There is an international standard measurement system of UV strength, called UV index. The UV sensor in Samsung Gear S returns numeric value from 0-15 corresponding to UV index. The Index is equal to the EAS-weighted irradiance (in watts/m²) x 40. An Index of 10 is equivalent to an EAS-weighted irradiance of 0.25 W/m².

  

