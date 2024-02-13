
![TITLE](https://img.shields.io/badge/MotoBudzetAPI%20-%20v1.0-blue)
 
<br>
<h1 align="center">Moto-Budżet</h1>
<br>

<h1 align="center">A Modern Platform for Automotive Advertisements <br> Spring Boot application (backend project)</h1>


<p align="center">
MotoBudzet is a comprehensive web portal designed for creating and managing automotive advertisements with ease. 
Engineered with a robust backend built on Java 17 and Spring Boot, the platform ensures reliable and efficient performance. 
</p>

<p align="center">
Data persistence is elegantly handled by PostgreSQL, coupled with Hibernate for object-relational mapping, application
has been carefully designed with special attention to reducing SQL queries to the database, particularly addressing
the N+1 query issue. This optimization ensures efficient data retrieval and significantly improves the performance of the
application by minimizing unnecessary database load making interactions with the database seamless and swift.
</p>

<p align="center">
Application enhances its robust architecture through the integration of a reverse proxy server using Nginx. 
This setup significantly bolsters security by ensuring that internal services are not directly exposed to the external network. 
In addition, vps server is integrated with Cloudflare's DNS services, which provides an additional layer of protection. 
By leveraging Cloudflare, server's IP address is not publicly disclosed, further shielding it from potential external threats.
This combination of a reverse proxy and Cloudflare DNS significantly strengthens the platform's security measures, 
offering robust protection against external threats. This ensures a secure and dependable environment for users and their data,
safeguarding both against unauthorized access and potential internet vulnerabilities.
</p>

<p align="center">
Additionally, api is secured with a JWT token, which is further encrypted using the AES256 algorithm to ensure greater security. 
Token is typically transmitted and stored in an HttpOnly cookie, to which foreign JavaScript code should not have access.
</p>

<p align="center">
Application backend is complemented with a user-friendly frontend, utilizing HTML5, CSS3, and JavaScript
to deliver a responsive and engaging user experience. Every aspect of MotoBudzet is crafted to streamline the 
process of posting and browsing automotive listings.
</p>


<h1 align="center">Backend stack :</h1>


<p align="center">
  <img src="https://img.shields.io/badge/Java-orange?style=for-the-badge">
  <img src="https://img.shields.io/badge/17-gray?style=for-the-badge">
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring">
  <img src="https://img.shields.io/badge/apache maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white">
  <img src="https://img.shields.io/badge/Thymeleaf-%23005C0F.svg?style=for-the-badge&logo=Thymeleaf&logoColor=white">
  <img src="https://img.shields.io/badge/yaml-%23fffff.svg?style=for-the-badge&logo=yaml&logoColor=151515&#41">
  <img src="https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka">
  <img src="https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white&#41">
</p>

<br>

<h1 align="center">Deployed on :</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white">
  <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/apache%20tomcat-%23F8DC75.svg?style=for-the-badge&logo=apache-tomcat&logoColor=black">
  <img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white">
  <img src="https://img.shields.io/badge/HomeCLOUD.pl-white?style=for-the-badge&logo=Cloudflare&logoColor=red">
</p>
<br>

<h1 align="center">Monitoring & Tracing :</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Prometheus-000000?style=for-the-badge&logo=prometheus&labelColor=00000">
  <img src="https://img.shields.io/badge/Grafana-black?style=for-the-badge&logo=grafana&logoColor=orange">
  <img src="https://img.shields.io/badge/loki-black?style=for-the-badge&logo=grafana&logoColor=orange">
  <img src="https://img.shields.io/badge/promtail-black?style=for-the-badge&logo=grafana&logoColor=orange">
  <img src="https://img.shields.io/badge/Brave-FB542B?style=for-the-badge&logo=Brave&logoColor=white">
<br>
  <img src="https://img.shields.io/badge/Micrometer-000000?style=for-the-badge">
  <img src="https://img.shields.io/badge/Zipkin-000000?style=for-the-badge">
</p>
<br>


<h1 align="center">Testing libraries :</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Junit5-25A162?style=for-the-badge&logo=junit5&logoColor=white">
  <img src="https://img.shields.io/badge/AssertJ-25A162?style=for-the-badge">
  <img src="https://img.shields.io/badge/Mockito-78A641?style=for-the-badge">
  <img src="https://img.shields.io/badge/Testcontainers-9B489A?style=for-the-badge">
</p>
<br>

<h1 align="center">Frontend stack :</h1>
<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
</p>
<br>


<h1 align="center">Technical REST API Documentation :</h1>
<p align="center">
  <img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white">
</p>
<br>

```
https://motobudzet.pl/swagger-ui/index.html 
```

<br>

<h1 align="center">Authorize credentials needed to access admin account:</h1>

## Login : 
```
admin
```
## Password : 
```
admin
```

<h1 align="center">Project compilation & local docker mount:</h1>

```bash
 mvn clean install jib:dockerBuild -Plocal
```

<h1 align="center">Docker deployment:</h1>

```bash
docker compose up
```



<hr>
<h1 align="center">URLs</h1>

|                                                                                                                                          Service                                                                                                                                          |                       LOCAL                        |                                                                                                                                                                                          PRODUCTION                                                                                                                                                                                          |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       |                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                  |                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                             |
|                                                                                                                                        LandingPage                                                                                                                                        | [http://localhost:20134/](http://localhost:20134/) |                                                                                                                                                                        [https://motobudzet.pl](https://motobudzet.pl)                                                                                                                                                                        |
|                                                                                                                                        Prometheus                                                                                                                                         |  [http://localhost:9090/](http://localhost:9090/)  |                                                                                                                                                                    [http://46.41.150.96:9090/](http://46.41.150.96:9090/)                                                                                                                                                                    |
|                                                                                                                                          Grafana                                                                                                                                          |  [http://localhost:3000/](http://localhost:3000/)  |                                                                                                                                                                    [http://46.41.150.96:3000/](http://46.41.150.96:3000/)                                                                                                                                                                    |
|                                                                                                                                          Zipkin                                                                                                                                           |  [http://localhost:9411/](http://localhost:9411/)  |                                                                                                                                                                    [http://46.41.150.96:9411/](http://46.41.150.96:9411/)                                                                                                                                                                    |
|                                                                                                                                          Jenkins                                                                                                                                          | [http://localhost:27015/](http://localhost:27015/) |                                                                                                                                                                   [http://46.41.150.96:27015/](http://46.41.150.96:27015/)                                                                                                                                                                   |
|                                                                                                                                          pgAdmin                                                                                                                                          |  [http://localhost:5050/](http://localhost:5050/)  |                                                                                                                                                                    [http://46.41.150.96:5050/](http://46.41.150.96:5050/)                                                                                                                                                                    |

<h1 align="center" style="color: red">Warning </h1>

<p align="center">
Due to weak VPS (1vCore , 2GB RAM) , jenkins and pgAdmin is turned off on production environment.
</p>
<br>
<hr>
<h1 align="center">Exporting docker images on remote repository:</h1>

<h1 align="center">Pre-requisites for Compilation & Deployment</h1>

<br>
<p align="center">
Before running the build and push command, make sure to update your credentials in the `pom.xml` file. This is necessary for the authentication process with the repository where the image will be pushed.
</p>

Here are the steps to follow:

1. Open the `pom.xml` file.
2. Locate the `<auth>` configuration block within the `<configuration>` section of the `jib-maven-plugin`.
3. Replace the `${repo.username}`,`${repo.password}` and `${repo.prefix}` placeholders in project properties with your actual repository username and password.

```bash
 mvn clean install jib:build -Ppush
```

<hr>

<h1 align="center">Project GUI :</h1>

<h1 align="center">User navigation bar</h1>
<br>

<p align="left">
1. All user account interactions & possibilities can be accesed from navigation bar which is located on top of the site.<br>
2. If user is logged in, after clicking each button is directly redirected to section that he is interested in.<br>
3. If user is not logged , he is redirected to the login page on which he also can create an account.<br>
4. Site graphic logo, sends an user to main landing page.<br>
5. Whole navigation bar is responsive, it fades opacity out when scrolling on to the bottom of site, also buttons react when mouse on.<br>
</p>

<br>

<p align="center">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/423147411_698521395799102_238197426782614510_n.png?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=YfwN3QWE9O0AX84Ylo3&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdQYO_DevqbMdF0f9ItjW3FCLdoh7ATiyjqk2jo7JJ64Rg&oe=65E81748">
</p>

<h1 align="center">Zoom in-out & dark-light mode section</h1>

<br>

<p align="left">
1. In the left bottom corner appears to be an panel which controls dark/light theme of the site.<br>
2. It also has an slider which sets up a size of each element on the page. User can individually choose his own scale depending on his needs.<br>
</p>

<br>
<p align="center">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/422466624_1575198149972618_3612689015995557063_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=xQ5NemmzGesAX8Gmg2k&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdR2hCGVKtKohMlNdGwlwa752tX5kFqteBIOneC5QSloYA&oe=65E8030E">
</p>


<h1 align="center">Management Button</h1>

<br>

<p align="left">
1. When user has specified admin role, a button appears in site control section.<br>
2. After clicking this button, user is redirected to management section which allows to approve or reject advertisements that has PENDING_VERIFICATION status.<br>
</p>

<br>
<p align="center">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/421569127_2698926376932505_7001156687979102144_n.png?_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=MhJ7li3WJV4AX9B_Zqb&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdQxd6AlUmbkI1KbNM8ZYKJOwQD0d2-TPxrKAV4JoujExQ&oe=65E82ADD">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/422610907_1332604710712368_7509768594715880137_n.png?_nc_cat=102&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=21G_VPOd7poAX9wNWQd&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdRm5KlGIr72D-CkUSAQ-g1ta_HG5hzvuLdEv8ZcePkDSA&oe=65E81BFA">
 
<p align="center">
When admin management user enters into advertisement that status needs to be resolved , an verification panel occurs.<br>
</p>

<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/421531962_351118654382827_1098160725967692080_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=jTuZ6-_KiskAX8bLPk-&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdRsNgYTgi80KGBMtd_Ww6YaK7yDX91rp2iz1mScKnyJzA&oe=65E808AC">


<br>
<hr>

<h1 align="center">Filtering & searching specified advertisements</h1>

<br>

<p align="left">
1. Displayed on main landing page search form allows user to rapidly iterate through database data.<br>
2. User can specify his needs by filling parameters which he is interested in.<br>
3. Each change on form automatically sends api request to fetch & display specified filter count on the search button.<br>
4. Filled form values change color to create clear contrast which parameters have been set up.<br>
5. User can add advertisement to favourites or edit his own directly from searching page.<br>
6. Sorting & paging is handled by friendly gui buttons seen on the screen.<br>
7. Search url link is being build up dynamically from specified search,sort and pagination params.<br>
</p>

<br>

<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/422917132_374871275150249_4980121352853950744_n.png?_nc_cat=106&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=EM5y7FWP1c0AX-Ttbwn&_nc_oc=AQkm2mXq6iyAqYBPQ9XcOYpCKw3_D8Pf6B2QaCcttVvGVaDHa-oD6-4zSIc6U7DxMBU&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdQ_fQWPcwxGh7wdB80OQ7l8ISih2vE1eDELCybrgdl-Qw&oe=65E81759">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/421433460_230513610128028_258298521341429348_n.png?_nc_cat=102&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=rvCTnzpw3q4AX9cVl8g&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdTbFUusZgSv7vtCpA5lMBX6mqp8NdVMebTeOw35XyrlPA&oe=65E80032">


<p align="center">
On the bottom of homepage we can find last uploaded advertisements which are being filtered by descending order.
</p>

<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/426133342_405427435236223_5536719586035504641_n.png?_nc_cat=108&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=cDwOMbBFRncAX-hPGYj&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdTeIcPmuTf2GTS_dc-O0Wv5xphGWg0unejlcBxvC5uowA&oe=65EAA546">


<br>
<hr>

<h1 align="center">Advertisement layout page</h1>
<br>

<p align="left">
1. Each advertisement has its own unique url guiding you to a page with its detailed information and full description.<br>
2. It has nice looking gallery on which u can pick photo or iterate with keyboard left & right arrows.<br>
3. Layout contains advertisement details and formatted description provided by user.<br>
4. On the top of the site next to advertisement title , we can see few buttons which can create new conversation, add link to favourites or edit advertisement if user is an owner.
</p>

<br>

<p align="center">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/422903158_879793593945063_6814196973439269125_n.png?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=vqVN65GhEzcAX8Ma3BW&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdTamUnCDKX23ZdtReGyChfofuU11T8hIZ6vbmAE5wv27g&oe=65E7F6BF"><img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/422452287_413045284447150_5068046255466262118_n.png?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=RC84mcNrQTsAX9KwsbZ&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdQI8XbYKbvjPCf0vrIUQPxrd8hobc90vaEJOTDb92oC0Q&oe=65E7F3AA">
 </p>

 
<br>
<hr>

<h1 align="center">Creating and editing an advertisement</h1>

<br>

<p align="left">
1. Graphically friendly form allows user to interact with api very kind and smoothly.<br>
2. User just has to fill the form parameters and pick up some photos with drag&drop method or selecting files manually from disk space.<br>
3. Position of photos can be easily swapped just by grabbing them with left mouse click and drag with mouse move.<br>
4. Each photo uploaded on site is getting an unique url link and watermark on the bottom right side with service logo.
</p>

<br>

<p align="center">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/423105650_1780116722450997_7640040345684711473_n.png?_nc_cat=102&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=rDwV9q9ANngAX9bZc8k&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdQuw4PW7OtalMIfwosBZx8q9S7SldJX0MUkxRF_45HFUg&oe=65E7D5B1">
</p>


<br>

<p align="center">
Create & edit form comes with a nice text formatting editor for creating a description of the specified advertisement.<br>
</p>

<br>

<p align="center">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/421695291_1485639528683820_374135017219074944_n.png?_nc_cat=106&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=0sgOdAkkf7sAX_cHMud&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdSk_A0kvdBeQoqfC6fArKqzMTOpVrGUdbBkViO3Dny2-g&oe=65E7FF9F">
</p>

<br>
<hr>


<h1 align="center">Messaging between users</h1>

<br>

<p align="left">
1. Messaging section provides user friendly gui with a list of created conversations.<br>
2. Conversation list is ordered by last message descending timestamp.<br>
3. Each conversation preserves some basic data as advertisement title ,  name of second user , last message value and when message was delivered or displayed.
</p>

<br>

<p align="center">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/423062794_422504793542248_1369098636429791305_n.png?_nc_cat=109&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=5aqLPsiwE5IAX_-BGfT&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdQ9C-6lai2QZ4xAS_ROVpepB_m3vMAxa008Z4aFpTxjCw&oe=65E8045D">
</p>

<br>

<p align="center">
We can easily enter picked chat with a left click and display set of messages that appeared in each conversation.
</p>

<br>

<p align="center">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/421681127_7169175966496745_2842020596038635088_n.png?_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=lWag90VUhVkAX-eb8vX&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdTG73Vi2X3TktDvud8zqURl9FJhqg5Io8_XODwPoRFSvQ&oe=65E81E1C">
</p>

<br>
<hr>

<h1 align="center">Managing advertisements & favourites </h1>

<br>

<p align="center">
User can manage his own advertisements or favourites in specified tab which can be accesed from top navigation bar<br>
</p>
<br>

<p align="center">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/421837276_926134135664151_1174917246925344725_n.png?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=7ysFHpkQS40AX-UhUwd&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdQzYFuWKzNAql6ApkMQkh3SxVbXpRB5CbmY1ftozrS9wQ&oe=65E7EF6F">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/421493289_210657532069479_4197790199393250240_n.png?_nc_cat=108&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=d8wfO9tdzjAAX93a45M&_nc_oc=AQmJmikj5i96HxrE6-4gGyPTN4Tk12J9drVr7bhRympfDjWButdw86iSmQlEqk2Yk7s&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdRnIEJd54lneoWIqbGdHc9qqf-fTREUk9hLJliuZKd6ag&oe=65E814CC">

</p>
<hr>

<h1 align="center">Asynchronous mailing service</h1>
 
<br>

<p align="left">
1. Whole api is completed with active mailing service.<br>
2. Mailing service is asynchronously handled through apache kafka message queue.<br>
3. Every request between services is being traced with trace & span ID.<br>
4. Mailing service sends an email each time when some activity happens.<br>
5. As displayed below , it sends an email every time when user tries to : <br>
 
<br>
- Register a new account <br>
- Gets a message from different user <br>
- Reset his password <br>
- Create a new advertisement (sends e-mail to management) <br>
- Edit existing advertisement (sends e-mail to management) <br>
- When admin activates an advertisement (user gets an email with link and confirmation that is active)
</p>

<br>

<p align="center">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/426807304_322062893636099_1287820160081465929_n.png?stp=dst-png_s2048x2048&_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=5WoELij58bsAX85T95_&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdTuJBAoYdG796POSgezBnBq5p_gGAEAPtTnPtVb4st-wA&oe=65F2BC7E">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/426715838_919687946151721_9131697903424628067_n.png?stp=dst-png_s2048x2048&_nc_cat=107&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=XNByxPi4dbsAX_Vy-VS&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdQ_TXITvzR7Y_Sb0Azw08wCC_VVEUsyW4BUNpjg97ynNg&oe=65F2BEFD">
<br>
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/423036509_1833572503782083_5473750886199136916_n.png?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=A6pMBLeeTLIAX-ebhsd&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdSs2A73k7vu3k50frQtqJ1Wn8JOGOG3JJ7f6Fl_2RkPVQ&oe=65E7F8CB">
<img src="https://scontent.fwaw3-2.fna.fbcdn.net/v/t1.15752-9/422783272_398823966119665_7372210058124691296_n.png?_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=lYLXPXwMYeYAX-xLyLe&_nc_ht=scontent.fwaw3-2.fna&oh=03_AdQ7XNVSG1iiOc4tyUPqkr5UIXc9UVeLujDOxzy-32sBwA&oe=65E81CB0">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/422708941_399342009261369_3259540669228235302_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=77WZvHn0jbEAX-lLcP-&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdT-ucyuBhRrGPq8nYMtTtZBVLvMaQ1tr2eEdgbgn_f0tg&oe=65E8242F">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/422756691_772547801112505_8098600164563021112_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=1gJLRwTfRF0AX9-RkqH&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdQuj_6_02Q7L8Ni5hmPCnM5_6M6AMwWz2GnFO_0-Cf-3Q&oe=65E80453">
<img src="https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.15752-9/422882021_413539157870731_7506296841668719040_n.png?_nc_cat=108&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=jbhOWzfaYswAX_OzdaZ&_nc_ht=scontent.fwaw3-1.fna&oh=03_AdSF3AEhgyqT1xm989ro3S0vbI45HmDhQKkbWWrG91oCdQ&oe=65E7FA4C">
</p>

<br>



