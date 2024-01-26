
![TITLE](https://img.shields.io/badge/MotoBudzetAPI%20-%20v1.0-blue) <br>
# Moto-Budżet
## A Modern Platform for Automotive Advertisements - Spring Boot application (backend project)

MotoBudzet is a comprehensive web portal designed for creating and managing automotive advertisements with ease. 
Engineered with a robust backend built on Java 17 and Spring Boot, the platform ensures reliable and efficient performance. 

Data persistence is elegantly handled by PostgreSQL, coupled with Hibernate for object-relational mapping, application
has been carefully designed with special attention to reducing SQL queries to the database, particularly addressing
the N+1 query issue. This optimization ensures efficient data retrieval and significantly improves the performance of the
application by minimizing unnecessary database load making interactions with the database seamless and swift.

Application enhances its robust architecture through the integration of a reverse proxy server using Nginx. 
This setup significantly bolsters security by ensuring that internal services are not directly exposed to the external network. 
In addition, vps server is integrated with Cloudflare's DNS services, which provides an additional layer of protection. 
By leveraging Cloudflare, server's IP address is not publicly disclosed, further shielding it from potential external threats.
This combination of a reverse proxy and Cloudflare DNS significantly strengthens the platform's security measures, 
offering robust protection against external threats. This ensures a secure and dependable environment for users and their data,
safeguarding both against unauthorized access and potential internet vulnerabilities.


Additionally, api is secured with a JWT token, which is further encrypted using the AES256 algorithm to ensure greater security. 
Token is typically transmitted and stored in an HttpOnly cookie, to which foreign JavaScript code should not have access.


Application backend is complemented with a user-friendly frontend, utilizing HTML5, CSS3, and JavaScript
to deliver a responsive and engaging user experience. Every aspect of MotoBudzet is crafted to streamline the 
process of posting and browsing automotive listings.


## Backend stack : <br>


[//]: # (![JAVA17]&#40;https://img.shields.io/badge/17-Java-orange?style=for-the-badge&#41; &nbsp;)
![JAVA](https://img.shields.io/badge/Java-orange?style=for-the-badge)![17](https://img.shields.io/badge/17-gray?style=for-the-badge) &nbsp;
![SPRING](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring) &nbsp;
![MAVEN](https://img.shields.io/badge/maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white) &nbsp;
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)  &nbsp;
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white)  &nbsp;
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)  &nbsp;
![THYMELEAF](https://img.shields.io/badge/Thymeleaf-%23005C0F.svg?style=for-the-badge&logo=Thymeleaf&logoColor=white)  &nbsp;


![YAML](https://img.shields.io/badge/yaml-%23ffffff.svg?style=for-the-badge&logo=yaml&logoColor=151515)  &nbsp;
![JSON](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)  &nbsp;
<br><br>
## Deployed on :<br>
![DOCKER](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white) &nbsp;
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white) &nbsp;
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) &nbsp;
![Apache Tomcat](https://img.shields.io/badge/apache%20tomcat-%23F8DC75.svg?style=for-the-badge&logo=apache-tomcat&logoColor=black) &nbsp;
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white) &nbsp;
![HomeCloud](https://img.shields.io/badge/HomeCLOUD.pl-white?style=for-the-badge&logo=Cloudflare&logoColor=red) &nbsp;
<br><br>
## Monitoring & Tracing : <br>
![PROMETHEUS](https://img.shields.io/badge/Prometheus-000000?style=for-the-badge&logo=prometheus&labelColor=00000)  &nbsp;
![GRAFANA](https://img.shields.io/badge/Grafana-black?style=for-the-badge&logo=grafana&logoColor=orange) &nbsp;
![LOKI](https://img.shields.io/badge/loki-black?style=for-the-badge&logo=grafana&logoColor=orange) &nbsp;
![PROMTAIL](https://img.shields.io/badge/promtail-black?style=for-the-badge&logo=grafana&logoColor=orange) &nbsp;
![Brave](https://img.shields.io/badge/Brave-FB542B?style=for-the-badge&logo=Brave&logoColor=white) &nbsp;
<br><br>
## Frontend stack :<br>
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) &nbsp;
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) &nbsp;
![JS](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
<br><br>
## Testing libraries :<br>
![JUNIT](https://img.shields.io/badge/Junit5-25A162?style=for-the-badge&logo=junit5&logoColor=white) &nbsp;
![ASSERTJ](https://img.shields.io/badge/AssertJ-25A162?style=for-the-badge) &nbsp;
![MOCKITO](https://img.shields.io/badge/Mockito-78A641?style=for-the-badge) &nbsp;
![TESTCONTAINERS](https://img.shields.io/badge/Testcontainers-9B489A?style=for-the-badge) &nbsp;
<br><br>
## Technical REST API Documentation :<br>
![SWAGGER](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

```
https://motobudzet.pl/swagger-ui/index.html 
```

<br>

Authorize credentials needed to access :
## Login : 
```
admin
```
## Password : 
```
admin
```
## Project compilation: 
```bash
 mvn clean install jib:dockerBuild -Plocal
```
## Docker deployment:
```bash
docker compose up
```
## Url when running locally:
```bash
https://localhost/
```

