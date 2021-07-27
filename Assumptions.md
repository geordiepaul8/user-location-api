# Assumptions

The following list is a set of assumptions made when completing the task of the user-location-api.

-   There was no specified limit for the range to use to london. The exact wording of the task states: 
    ```bash
    ...or whose current coordinates are within 50 miles of London
    ``` 

    I took the term `within` to mean less than. Therefore all calculations of distance using the coordinates are anything `<50 miles`.
-   Again, based on the term in the above point, there was no specified single coordinate that defined where `London` was. If this was a task set out in Sprint, I would immediately have rejected it as it would not have met the definition of `Ready`. I would work with the BAs to understand what the definition for this would be and to ensure the rule is clear and unambiguous. There were a couple of different ways I could have interpreted the coordinates for London which would have been used to define the distance:
    
    - We know all of the users that live in London, I could have taken the northern-most & southern-most latitide, along with the eastern-most & western-most longitude and created an average (centre point) coordinate for all of those people.

    - I could have taken a set of coordinates from the internet by picking an arbitrary point in the center of London and used that (although the radius defined as London would probably be larger than the 50 miles).

    - I could go very convoluted and try to figure out a boundary and calculate the coordinates that are closest to a point on the boundary to London. This would be very difficult to achieve.

- My solution was: the only known coordinates for London were in the profile of those users that live in London. Therefore I took it upon myself to take those users that do not live within London and check them against all of those that do. If they fall within 50 miles (< 50) then they are deemed as a user that lives within the 50 mile range of London. There could be a performance hit if the user list grows. At present, there are only 6 people deemed living in London, however the larger the list, then the increase to the performance hit.

-   I implemented a basic health endpoint `/health` as my assumption would be that this service would be hosted in AWS and a health endpoint would be required to help stabilise the service.

-  I decided not to include CORS configuration. However, this should be considered / implemented to restrict access to whitelisted/blacklisted domains & certain methods (`OPTIONS` / `GET`), for example browser requests.

- The task was to return a list of users and I decided that it should only return the `id`, `first_name` and `last_name` fields only. I was thinking security-first and is something I would go back to the team to decide what is needed. I would seek futher discussions with the Tech Architect, BA and data-guardians to understand what data should be returned.

- As the task just asked for a list of users in the response, I decided against building an accessible UI that displays a the list of users. Instead, it returns an array item containing a user object. If a UI was a requirement, further discussion with UX/UI/Content design team would be required to ensure an accessible screen is presented.

- There was no defined measure as to how performant the API needs to be. A definition of response times vs number of requests would help improve the requirements.

# Constraints

Given the time allocated, there were a couple of updates / improvements I would bring in to the service to help with performance / availability / security :

-   I would bring in `https` to the service which would ingest the `cachain` certs form the host environment.

-   The data is being passed through the middleware under the `req.data` object, however I would have implemented a session state to help with maintinaing state during minor outages etc.

-   Filtering the response payload to remove unnecessary PII data is just a simple filtering method. I would implement a GraphQL client and that way we could just send a filtered request payload as per the requirements.

-   I would have provided a simple CI pipeline to build the application with all verification steps (test, assure, quality).

-   As mentioned above, the ticket was ambiguous with the requirements. I would have tried to speak to the relevant people within the team to understand further the specific requirements of the task.

-   I would have used a JSON schema validator (such as `ajv`) that would validate the response from the API based on the swagger definition.

-   The dockerfile uses a hardening script to help with enhancing security best practices, however best practice would be to use a `distroless` image.

-   The npm package `helmet` uses the default configuration. With more time, more detailed configuration would be considered and implemented.

-   I could have developed a Java Springboot service and given the majority of the backend services within my PDU use Java maybe this should have been the default. However, as I started solving the problem using JS, given the time available I continued with NodeJS.

-   The integration tests are light and exist to show the framework that could be used. The unit tests are highly detailed, but I would have provided more detailed integration tests based on error responses etc..

-   I would have provided a K6 performance script (integrated with prometheus & grafana) to look at all-round performance measures (including memory management to detect leaks etc).

-   I would have implemented a NGINX proxy server that fronts the API and could help with restricting the requests per second.

-   To help with performance, I could have implemented a cache using Redis, unless the requirement is for the api to be completely stateless.