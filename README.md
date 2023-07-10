# Technical Exercice

Create the backend and the frontend of a single-page application that presents a weekly calendar.

## Prerequisites

- docker and docker compose v2
- node (v18 at least) and npm


## To run the backend 

In the folder calendar-backend :
- run ```docker compose build ```
- run ```docker compose up ```


## To run the frontend

In the folder calendar-frontend :
- run ``` npm install```
- run  ```npm run dev```

## Brief tour of the app

The frontend will be available at the url http://localhost:8080, you will arrive on the register page. 

This register page will lead you to a calendar page once you've created an account. 
You can click on the calendar to create an event or use the button on left. 
You can click on an event to show its details and then, update it or delete it.
You can change the week displayed by selecting a date on the left as well.
You can also see the events created by another user by clicking on the button "Voir les évènements d'un autre utilisateur". 

Finally, you can log out. This will lead you back to the register page. There's a link to the login page if you want to use the same user. 